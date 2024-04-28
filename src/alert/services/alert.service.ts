import { Injectable, Logger } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { Alert } from "../entities/alert.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAlertDto } from "../dto/create-alert.dto";
import { UserService } from "../../user/services/user.service";
import { CoinService } from "../../coin/services/coin.service";
import { AlertNotFoundException } from "../exceptions/alert-not-found.exception";
import { ConditionTypeService } from "./condition-type.service";
import { ReadAlertsListDto } from "../dto/read-alerts-list.dto";
import { UpdateAlertDto } from "../dto/update-alert.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
    JOB_ALERT_TRIGGERING,
    PARAM_COINGECKO_DEFAULT_PRECISION,
    PARAM_COINGECKO_DEFAULT_VS_CURRENCIES,
    QUEUE_ALERT_TRIGGERING
} from "../../common/constants";
import { CoinGeckoService } from "../../coin/services/coingecko.service";
import { IGroupedBy } from "../../common/interfaces/grouped-by";
import { CoinPriceDto } from "../../coin/dto/coin-price.dto";
import { logicalOperation } from "../../common/utils/operation";
import { AlertAndCoinPriceDto } from "../dto/alert-with-coin-price.dto";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class AlertService {
    private readonly logger = new Logger(AlertService.name);

    constructor(
        private readonly userService: UserService,
        private readonly coinService: CoinService,
        private readonly coinGeckoService: CoinGeckoService,
        private readonly conditionTypeService: ConditionTypeService,
        @InjectQueue(QUEUE_ALERT_TRIGGERING)
        private readonly alertTriggeringQueue: Queue,
        @InjectRepository(Alert)
        private readonly alertRepository: Repository<Alert>
    ) {}

    async getAlertById(alertId: number): Promise<Alert> {
        const alert = await this.alertRepository.findOne({
            where: {
                id: alertId
            },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                isActive: true,
                triggeredAt: true,
            },
            relations: {
                coin: true,
                condition: {
                    type: true
                }
            }
        });

        if (!alert)
            throw new AlertNotFoundException("Alert not found!");

        return alert;
    }

    async createAlert(dto: CreateAlertDto): Promise<Alert> {
        const user = await this.userService.getUserById(dto.userId);
        const coin = await this.coinService.getCoinById(dto.coinId);
        const type = await this.conditionTypeService.getConditionTypeById(dto.condition.typeId);

        const alert = this.alertRepository.create({
            ...dto,
            condition: {
                ...dto.condition,
                type
            },
            user,
            coin
        });
        
        await this.alertRepository.save(alert, { reload: true });

        return this.getAlertById(alert.id);
    }

    async updateAlert(alertId: number, dto: UpdateAlertDto): Promise<Alert> {
        const oldAlert = await this.getAlertById(alertId);
        let type = oldAlert.condition.type;

        if (dto.condition.typeId !== oldAlert.condition.type.id)
            type = await this.conditionTypeService.getConditionTypeById(dto.condition.typeId);

        return this.alertRepository.save({
            ...oldAlert,
            condition: {
                ...oldAlert.condition,
                ...dto.condition,
                type
            }
        });
    }

    async setAlertTriggerDate(alertId: number, triggerDate: Date) {
        const alert = await this.getAlertById(alertId);

        alert.triggeredAt = triggerDate;

        await this.alertRepository.save(alert);
    }

    async removeAlert(alertId: number) {
        const alert = await this.getAlertById(alertId);

        await this.alertRepository.remove(alert);
    }

    async getAlertsList(dto: ReadAlertsListDto): Promise<Alert[]> {
        let where: FindOptionsWhere<Alert> = {};

        if (dto.userId)
            where['user.id'] = dto.userId;

        if (dto.coinId)
            where['coin.id'] = dto.coinId;

        if (dto.isActive)
            where['isActive'] = dto.isActive;

        return this.alertRepository.find({
            where,
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                isActive: true,
                triggeredAt: true
            },
            relations: {
                coin: true,
                condition: {
                    type: true
                }
            }
        });
    }

    async getAlertsListGroupedByCoinId(dto: ReadAlertsListDto): Promise<IGroupedBy<Alert[]>> {
        const queryBuilder = this.alertRepository
            .createQueryBuilder('alert')
            .leftJoin('alert.user', 'user')
            .leftJoinAndSelect('alert.coin', 'coin')
            .leftJoinAndSelect('alert.condition', 'condition')
            .leftJoinAndSelect('condition.type', 'type');

        if (dto.userId)
            queryBuilder.where('user.id = :userId', { userId: dto.userId });

        if (dto.coinId) {
            if (dto.userId)
                queryBuilder.andWhere('coin.id = :coinId', { coinId: dto.coinId });
            else
                queryBuilder.where('coin.id = :coinId', { coinId: dto.coinId });
        }

        if (dto.isActive !== undefined) {
            const sql = dto.isActive ? 'alert.triggeredAt IS NULL' : 'alert.triggeredAt IS NOT NULL';

            if (dto.userId || dto.coinId) {
                queryBuilder.andWhere(sql);
            } else {
                queryBuilder.where(sql);
            }
        }
        
        queryBuilder
            .groupBy('coin.id')
            .addGroupBy('alert.id')
            .addGroupBy('condition.id')
            .addGroupBy('type.id')
            .orderBy('coin.id');

        const alertsList = await queryBuilder.getMany();

        let groupedBy: IGroupedBy<Alert[]>= {};

        alertsList.forEach(alert => {
            if (!groupedBy[alert.coin.id])
                groupedBy[alert.coin.id] = [ alert ];
            else
                groupedBy[alert.coin.id].push(alert);
        });

        return groupedBy;
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async checkCoinsListPrices() {
        try {
            const coinsList = await this.coinService.getCoinsListWithActiveAlerts();

            if (coinsList.length === 0)
                return;

            const coinsIds     = coinsList.map(coin => coin.id);
            const pricesResult = await this.coinGeckoService.getCoinPriceByIds({
                ids: coinsIds.join(','),
                vs_currencies: PARAM_COINGECKO_DEFAULT_VS_CURRENCIES,
                precision: PARAM_COINGECKO_DEFAULT_PRECISION
            });

            const resultIds = Object.keys(pricesResult);

            const alertsListGroupedByCoinId = await this.getAlertsListGroupedByCoinId({
                isActive: true
            });

            if (Object.keys(alertsListGroupedByCoinId).length === 0)
                return;

            const toTriggerAlertsList: AlertAndCoinPriceDto[] = [];

            resultIds.forEach(coinId => {
                const coinPrice: CoinPriceDto = pricesResult[coinId];
                const alertsList = alertsListGroupedByCoinId[coinId];

                alertsList.forEach(alert => {
                    const targetPrice = parseFloat(alert.condition.value);
                    const shouldTrigger = logicalOperation<number>(alert.condition.type.id)
                        .execute(targetPrice, coinPrice[PARAM_COINGECKO_DEFAULT_VS_CURRENCIES]);

                    if (shouldTrigger)
                        toTriggerAlertsList.push({ coinPrice, alert });
                });
            });

            await Promise.all(
                toTriggerAlertsList.map(
                    alertAndCoinPrice => this.alertTriggeringQueue.add(
                        JOB_ALERT_TRIGGERING, 
                        alertAndCoinPrice, 
                        {
                            attempts: 3,
                            removeOnComplete: true,
                            removeOnFail: true
                        }
                    )
                )
            )
        } catch (Exception) {
            this.logger.error(Exception);
        }
    }
}
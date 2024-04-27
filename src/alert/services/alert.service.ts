import { Injectable } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { Alert } from "../entities/alert.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAlertDto } from "../dto/create-alert.dto";
import { UserService } from "../../user/services/user.service";
import { CoinService } from "../../coin/services/coin.service";
import { AlertNotFoundException } from "../exceptions/alert-not-found.exception";
import { ConditionTypeService } from "./condition-type.service";
import { ReadAlertsListDto } from "../dto/read-alerts-list.dto";

@Injectable()
export class AlertService {
    constructor(
        private readonly userService: UserService,
        private readonly coinService: CoinService,
        private readonly conditionTypeService: ConditionTypeService,
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
}
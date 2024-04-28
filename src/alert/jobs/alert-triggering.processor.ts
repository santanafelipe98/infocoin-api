import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import {
    EMAIL_FROM,
    ENV_MAILGUN_DOMAIN_NAME,
    ENV_MAILGUN_TEMPALTE_PRICE_ALERT,
    JOB_ALERT_TRIGGERING,
    PARAM_COINGECKO_DEFAULT_VS_CURRENCIES,
    QUEUE_ALERT_TRIGGERING
} from "../../common/constants";

import { Job } from "bull";
import { MailerService } from "../../mailer/services/mailer.service";
import { UserService } from "../../user/services/user.service";
import { ConfigService } from "@nestjs/config";
import { AlertAndCoinPriceDto } from "../dto/alert-with-coin-price.dto";
import { ConditionTypes } from "../enums/condition-types.enum";
import { Logger } from "@nestjs/common";
import { AlertService } from "../services/alert.service";

@Processor(QUEUE_ALERT_TRIGGERING)
export class AlertTriggeringProcessor {
    private readonly logger: Logger = new Logger(AlertTriggeringProcessor.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        private readonly alertService: AlertService
    ) {}

    @Process(JOB_ALERT_TRIGGERING)
    async execute(job: Job<AlertAndCoinPriceDto>) {
        const { data } = job;

        const { alert, coinPrice } = data;
        const user = await this.userService.getUserById(alert.userId);

        const domain   = this.configService.get<string>(ENV_MAILGUN_DOMAIN_NAME);
        const template = this.configService.get<string>(ENV_MAILGUN_TEMPALTE_PRICE_ALERT)

        const now = new Date();

        await this.mailerService.sendMail({
            domain,
            options: {
                from: EMAIL_FROM,
                to: user.email,
                subject: `${alert.coin.name} - Price Alert (InfoCoin)`,
                template,
                "t:variables": JSON.stringify({
                    current_date: now.toString(),
                    coin_name: alert.coin.name,
                    coin_currency: PARAM_COINGECKO_DEFAULT_VS_CURRENCIES,
                    coin_current_price: coinPrice[PARAM_COINGECKO_DEFAULT_VS_CURRENCIES],
                    coin_target_price: alert.condition.value,
                    coin_price_status: alert.condition.type.id === ConditionTypes.GREATER_THAN_OR_EQUAL
                        ? 'upper'
                        : 'lower'
                })
            }
        });

        await this.alertService.setAlertTriggerDate(alert.id, now);
    }

    @OnQueueFailed()
    onFail(job: Job<AlertAndCoinPriceDto>) {
        this.logger.debug(`Job failed to trigger alert - ${JSON.stringify(job.data)}`);
    }

    @OnQueueCompleted()
    onComplete(job: Job<AlertAndCoinPriceDto>) {
        this.logger.debug(`Job completed to trigger alert - ${JSON.stringify(job.data)}`);
    }
}
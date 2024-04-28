import { Module } from '@nestjs/common';
import { ConditionTypeService } from './services/condition-type.service';
import { ConditionTypeController } from './controllers/condition-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionType } from './entities/condition-type.entity';
import { Condition } from './entities/condition.entity';
import { Alert } from './entities/alert.entity';
import { AlertService } from './services/alert.service';
import { AlertController } from './controllers/alert.controller';
import { UserModule } from '../user/user.module';
import { CoinModule } from '../coin/coin.module';
import { MailerModule } from '../mailer/mailer.module';
import { AlertTriggeringProcessor } from './jobs/alert-triggering.processor';
import { BullModule } from '@nestjs/bull';
import { QUEUE_ALERT_TRIGGERING } from '../common/constants';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Alert,
            ConditionType,
            Condition
        ]),
        CoinModule,
        UserModule,
        MailerModule,
        BullModule.registerQueue({
            name: QUEUE_ALERT_TRIGGERING
        })
    ],
    providers: [
        AlertService,
        AlertTriggeringProcessor,
        ConditionTypeService
    ],
    controllers: [
        AlertController,
        ConditionTypeController
    ]
})
export class AlertModule {}

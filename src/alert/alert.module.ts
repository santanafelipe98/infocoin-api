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

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Alert,
            ConditionType,
            Condition
        ]),
        CoinModule,
        UserModule
    ],
    providers: [
        AlertService,
        ConditionTypeService
    ],
    controllers: [
        AlertController,
        ConditionTypeController
    ]
})
export class AlertModule {}

import { Module } from '@nestjs/common';
import { ConditionTypeService } from './services/condition-type.service';
import { ConditionTypeController } from './controllers/condition-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionType } from './entities/condition-type.entity';
import { Condition } from './entities/condition.entity';
import { Alert } from './entities/alert.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Alert,
            ConditionType,
            Condition
        ])
    ],
    providers: [
        ConditionTypeService
    ],
    controllers: [
        ConditionTypeController
    ]
})
export class AlertModule {}

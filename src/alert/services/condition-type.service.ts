import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConditionType } from "../entities/condition-type.entity";
import { Repository } from "typeorm";
import { CreateConditionTypeDto } from "../dto/create-condition-type.dto";

@Injectable()
export class ConditionTypeService {
    constructor(
        @InjectRepository(ConditionType)
        private readonly conditionTypeRepository: Repository<ConditionType>
    ) {}

    async createConditionType(dto: CreateConditionTypeDto): Promise<ConditionType> {
        const conditionType = this.conditionTypeRepository.create(dto);

        return this.conditionTypeRepository.save(conditionType);
    }

    async getConditionTypesList(): Promise<ConditionType[]> {
        return this.conditionTypeRepository.find();
    }
}
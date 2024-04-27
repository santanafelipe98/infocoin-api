import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConditionType } from "../entities/condition-type.entity";
import { Repository } from "typeorm";
import { CreateConditionTypeDto } from "../dto/create-condition-type.dto";
import { ConditionTypeNotFoundException } from "../exceptions/condition-type-not-found.exception";
import { UpdateConditionTypeDto } from "../dto/update-condition-type.dto";

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

    async updateConditionType(id: number, dto: UpdateConditionTypeDto): Promise<ConditionType> {
        const conditionType = await this.getConditionTypeById(id);

        return this.conditionTypeRepository.save({
            ...conditionType,
            ...dto
        });
    }

    async getConditionTypeById(id: number): Promise<ConditionType> {
        const conditionType = await this.conditionTypeRepository.findOne({
            where: {
                id
            }
        });

        if (!conditionType)
            throw new ConditionTypeNotFoundException("Condition type not found!");

        return conditionType;
    }

    async getConditionTypesList(): Promise<ConditionType[]> {
        return this.conditionTypeRepository.find();
    }
}
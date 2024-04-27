import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ConditionTypeService } from "../services/condition-type.service";
import { CreateConditionTypeDto } from "../dto/create-condition-type.dto";
import { ConditionType } from "../entities/condition-type.entity";
import { ReadConditionTypeDto } from "../dto/read-condition-type.dto";

@Controller('conditions/types')
export class ConditionTypeController {
    constructor(
        private readonly conditionTypeService: ConditionTypeService
    ) {}

    @Post("create")
    async createConditionType(@Body() dto: CreateConditionTypeDto): Promise<ConditionType> {
        return this.conditionTypeService.createConditionType(dto);
    }

    @Get(":id")
    async getConditionTypeById(@Param() { id }: ReadConditionTypeDto): Promise<ConditionType> {
        return this.conditionTypeService.getConditionTypeById(id);
    }

    @Get("list")
    async getConditionTypesList(): Promise<ConditionType[]> {
        return this.conditionTypeService.getConditionTypesList();
    }
}
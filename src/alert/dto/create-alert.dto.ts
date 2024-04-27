import { Type } from "class-transformer";
import { CreateConditionDto } from "./create-condition.dto";
import { IsNotEmpty, IsUUID, ValidateNested } from "class-validator";

export class CreateAlertDto {
    @IsUUID("4")
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    coinId: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateConditionDto)
    condition: CreateConditionDto;
}
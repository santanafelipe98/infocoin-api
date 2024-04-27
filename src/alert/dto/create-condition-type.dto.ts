import { IsNotEmpty } from "class-validator";

export class CreateConditionTypeDto {
    @IsNotEmpty()
    description: string;
}
import { IsNotEmpty } from "class-validator";

export class ReadConditionTypeDto {
    @IsNotEmpty()
    id: number;
}
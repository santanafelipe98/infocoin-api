import { IsNotEmpty } from "class-validator";

export class CreateConditionDto {
    @IsNotEmpty()
    typeId: number;

    @IsNotEmpty()
    value: string;
}
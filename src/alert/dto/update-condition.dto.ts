import { IsNotEmpty } from "class-validator";

export class UpdateConditionDto {
    @IsNotEmpty()
    typeId: number;

    @IsNotEmpty()
    value: string;
}
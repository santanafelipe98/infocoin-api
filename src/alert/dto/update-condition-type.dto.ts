import { IsNotEmpty } from "class-validator";

export class UpdateConditionTypeDto {
    @IsNotEmpty()
    description: string;
}
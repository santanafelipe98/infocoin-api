import { IsNotEmpty } from "class-validator";

export class ReadAlertDto {
    @IsNotEmpty()
    id: number;
}
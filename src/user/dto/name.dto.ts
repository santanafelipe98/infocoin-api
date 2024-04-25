import { IsNotEmpty } from "class-validator";

export class NameDto {
    @IsNotEmpty()
    first: string;

    @IsNotEmpty()
    last: string;
}
import { IsNotEmpty } from "class-validator";

export class CheckPasswordResetCodeStatusDto {
    @IsNotEmpty()
    code: string;
}
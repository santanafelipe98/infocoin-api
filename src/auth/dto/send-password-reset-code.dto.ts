import { IsEmail, IsNotEmpty } from "class-validator";

export class SendPasswordResetCodeDto {
    @IsEmail()
    @IsNotEmpty()
    userEmail: string;
}
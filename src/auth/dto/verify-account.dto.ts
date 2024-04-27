import { IsNotEmpty } from "class-validator";

export class VerifyAccountDto {
    @IsNotEmpty()
    token: string;
}
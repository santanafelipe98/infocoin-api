import { IsNotEmpty, IsStrongPassword } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class ResetPasswordDto {
    @IsNotEmpty()
    code: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    @IsNotEmpty()
    password: string;

    @Match(ResetPasswordDto, (o: ResetPasswordDto) => o.password)
    @IsNotEmpty()
    confirmPassword: string;
}
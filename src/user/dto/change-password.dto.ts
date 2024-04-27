import { IsNotEmpty, IsStrongPassword } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

export class ChangePasswordDto {
    @IsNotEmpty()
    userId: string;

    @IsStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1
    })
    @IsNotEmpty()
    password: string;

    @Match(ChangePasswordDto, (o: ChangePasswordDto) => o.password)
    @IsNotEmpty()
    confirmPassword: string;
}
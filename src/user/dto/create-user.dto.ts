import { Type } from "class-transformer";
import { NameDto } from "./name.dto";
import { IsEmail, IsNotEmpty, IsStrongPassword, ValidateNested } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";


export class CreateUserDto {
    @ValidateNested()
    @Type(() => NameDto)
    name: NameDto;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    @IsNotEmpty()
    password: string;

    @Match(CreateUserDto, (c: CreateUserDto) => c.password)
    confirmPassword: string;
}
import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { HttpStatusCode } from "axios";
import { SignInDto } from "../dto/sign-in.dto";
import { AccessTokenDto } from "../dto/access-token.dto";
import { VerifyAccountDto } from "../dto/verify-account.dto";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @HttpCode(HttpStatusCode.Ok)
    @Post("sign-in")
    async signIn(@Body() dto: SignInDto): Promise<AccessTokenDto> {
        const token = await this.authService.signIn(dto);

        return {
            accessToken: token
        };
    }

    @Post('sign-up')
    async signUp(@Body() dto: CreateUserDto) {
        return this.authService.signUp(dto);
    }

    @Get('verify-account')
    async verifyAccount(@Query() { token }: VerifyAccountDto) {
        await this.authService.verifyAccount(token);

        return 'Your account has been successfully verified.'
    }
}
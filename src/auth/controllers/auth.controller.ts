import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { HttpStatusCode } from "axios";
import { SignInDto } from "../dto/sign-in.dto";
import { AccessTokenDto } from "../dto/access-token.dto";
import { VerifyAccountDto } from "../dto/verify-account.dto";
import { SendPasswordResetCodeDto } from "../dto/send-password-reset-code.dto";
import { PasswordResetCodeStatusDto } from "../dto/password-reset-code-status.dto";
import { CheckPasswordResetCodeStatusDto } from "../dto/check-password-reset-code.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";

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

    @HttpCode(HttpStatusCode.Ok)
    @Post('send/password-reset-code')
    async sendPasswordResetCode(@Body() { userEmail }: SendPasswordResetCodeDto) {
        return this.authService.sendPasswordResetCode(userEmail);
    }

    @Get('status/password-reset-code/:code')
    async checkPasswordResetCodeStatus(@Param() { code }: CheckPasswordResetCodeStatusDto)
        : Promise<PasswordResetCodeStatusDto> {
        return this.authService.checkPasswordResetCodeStatus(code);
    }

    @HttpCode(HttpStatusCode.Ok)
    @Post("reset-password")
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }
}
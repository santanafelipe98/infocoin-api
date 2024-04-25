import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { Response } from "express";
import { HttpStatusCode } from "axios";
import { SignInDto } from "../dto/sign-in.dto";
import { AccessTokenDto } from "../dto/access-token.dto";

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
    async signUp(@Body() dto: CreateUserDto, @Res() resp: Response) {
        const user = await this.authService.signUp(dto);

        return resp.location(`/users/${user.id}`)
            .sendStatus(HttpStatusCode.NoContent);
    }
}
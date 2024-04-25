import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { Response } from "express";
import { HttpStatusCode } from "axios";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('sign-up')
    async signUp(@Body() dto: CreateUserDto, @Res() resp: Response) {
        const user = await this.authService.signUp(dto);

        return resp.location(`/users/${user.id}`)
            .sendStatus(HttpStatusCode.NoContent);
    }
}
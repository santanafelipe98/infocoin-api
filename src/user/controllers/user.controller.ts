import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { User } from "../entities/user.entity";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { IRequest } from "../../common/interfaces/request";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("me")
    async getSignedInUser(@Req() req: IRequest): Promise<User> {
        return req.user;
    }
    
    @Get(":id")
    async getUserById(@Param("id") id: string): Promise<User> {
        return this.userService.getUserById(id);
    }
}
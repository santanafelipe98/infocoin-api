import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { User } from "../entities/user.entity";

@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(":id")
    async getUserById(@Param("id") id: string): Promise<User> {
        return this.userService.getUserById(id);
    }
}
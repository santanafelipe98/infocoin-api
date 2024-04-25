import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) {}

    async signUp(dto: CreateUserDto): Promise<User> {
        return this.userService.createUser(dto);
    }
}

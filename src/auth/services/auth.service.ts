import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '../../user/entities/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { UserNotFoundException } from 'src/user/exceptions/user-not-found.exception';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signUp(dto: CreateUserDto): Promise<User> {
        return this.userService.createUser(dto);
    }

    async signIn({ email, password }: SignInDto): Promise<string> {
        try {
            const user = await this.userService.getUserByEmail(email);
            const passwordMatch = await this.userService
                .comparePassword(password, user.passwordHash)

            if (!passwordMatch)
                throw new InvalidCredentialsException("Invalid credentials");

            const userPayload: UserPayloadDto = {
                sub: user.id,
                email: user.email,
                passwordId: user.passwordId
            };

            const token = await this.jwtService.signAsync(userPayload);

            return token;
        } catch (Exception) {
            if (Exception instanceof UserNotFoundException)
                throw new InvalidCredentialsException("Invalid credentials");
            
            throw Exception;
        }
    }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; 
import { ChangePasswordDto } from "../dto/change-password.dto";
import { PasswordChangeException } from "../exceptions/password-change.exception";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if (!user)
            throw new UserNotFoundException("User not found!");

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (!user)
            throw new UserNotFoundException("User not found!");

        return user;
    }

    async userExists(email: string) {
        return this.userRepository.exists({
            where: {
                email
            }
        });
    }

    async verifyUser(userId: string) {
        const now = new Date();

        const user = await this.getUserById(userId);

        await this.userRepository.save({
            ...user,
            verifiedAt: now
        });
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        const userExists = await this.userExists(dto.email);

        if (userExists)
            throw new UserAlreadyExistsException("User already exists");

        const { password, ...createUserDto } = dto;
        const passwordHash = await this.hashPassword(password);

        const user = this.userRepository.create({
            ...createUserDto,
            passwordHash
        });

        return this.userRepository.save(user);
    }

    async changePassword(dto: ChangePasswordDto) {
        const user = await this.getUserById(dto.userId);
        const passwordHash = await this.hashPassword(dto.password);
        const passwordId = uuidv4();

        // Check if the new password is the same as old one

        const isOldPassword = await this.comparePassword(
            dto.password, user.passwordHash);

        if (isOldPassword)
            throw new PasswordChangeException("Your new password cannot be the same as your old password.");

        await this.userRepository.save({
            ...user,
            passwordHash,
            passwordId
        });
    }

    async hashPassword(passwod: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(passwod, saltOrRounds);

        return hash;
    }

    async comparePassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
}
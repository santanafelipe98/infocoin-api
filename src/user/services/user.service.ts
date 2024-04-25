import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";
import * as bcrypt from 'bcrypt';

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

    async hashPassword(passwod: string): Promise<string> {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(passwod, saltOrRounds);

        return hash;
    }
}
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '../../user/entities/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { UserNotFoundException } from '../../user/exceptions/user-not-found.exception';
import { Repository } from 'typeorm';
import { VerificationToken } from '../entities/verification-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'typeorm-transactional';
import { MailerService } from '../../mailer/services/mailer.service';
import { ConfigService } from '@nestjs/config';
import {
    EMAIL_FROM,
    ENV_BASE_URL,
    ENV_MAILGUN_DOMAIN_NAME,
    ENV_MAILGUN_TEMPLATE_EMAIL_VERIFICATION, 
    PATH_ACCOUNT_VERIFICATION
} from '../../common/constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @InjectRepository(VerificationToken)
        private readonly verificationTokenRepository: Repository<VerificationToken>
    ) {}

    @Transactional()
    async signUp(dto: CreateUserDto): Promise<User> {
        const user = await this.userService.createUser(dto);
        const verificationToken = await this.createVerificationToken(user.id);

        const template = this.configService.get<string>(ENV_MAILGUN_TEMPLATE_EMAIL_VERIFICATION);
        const domain = this.configService.get<string>(ENV_MAILGUN_DOMAIN_NAME);
        const baseURL = this.configService.get<string>(ENV_BASE_URL);
        const accountVerificationPath = PATH_ACCOUNT_VERIFICATION;

        const accountVerificationUrl = `${baseURL}/${accountVerificationPath}?token=${verificationToken.token}`;

        await this.mailerService.sendMail({
            domain,
            options: {
                from: EMAIL_FROM,
                to: user.email,
                subject: "Verify your email address - InfoCoin",
                template,
                "t:variables": JSON.stringify({ account_verification_url: accountVerificationUrl })
            }
        });

        return user;
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

    async createVerificationToken(userId: string): Promise<VerificationToken> {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 3);
        
        const user = await this.userService.getUserById(userId);

        const verificationToken = this.verificationTokenRepository.create({
            expiresAt,
            user
        });

        return this.verificationTokenRepository
            .save(verificationToken);
    }
}

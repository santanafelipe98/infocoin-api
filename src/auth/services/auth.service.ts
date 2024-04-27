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
    ENV_MAILGUN_TEMPLATE_PASSWORD_RESET, 
    PATH_ACCOUNT_VERIFICATION
} from '../../common/constants';
import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { PasswordResetCodeStatusDto } from '../dto/password-reset-code-status.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @InjectRepository(VerificationToken)
        private readonly verificationTokenRepository: Repository<VerificationToken>,
        @InjectRepository(PasswordResetToken)
        private readonly passwordResetTokenRepository: Repository<PasswordResetToken>
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

    @Transactional()
    async verifyAccount(token: string) {
        const verificationToken = await this.verificationTokenRepository.findOne({
            where: {
                token
            }
        });

        if (!verificationToken)
            throw new TokenExpiredException("Token has expired!");

        const timestampComparison = Math.sign(verificationToken.expiresAt.getTime() - Date.now());

        if (timestampComparison < 0)
            throw new TokenExpiredException("Token has expired!");

        await this.verificationTokenRepository.remove(verificationToken);
        await this.userService.verifyUser(verificationToken.userId);
    }

    async createPasswordResetToken(userId: string): Promise<PasswordResetToken> {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 3);

        const user = await this.userService.getUserById(userId);

        const token = this.generateTokenCode(6);

        const passwordResetToken = this.passwordResetTokenRepository.create({
            token,
            expiresAt,
            user
        });

        return this.passwordResetTokenRepository.save(passwordResetToken);
    }

    async getPasswordResetTokenByToken(token: string): Promise<PasswordResetToken> {
        const passwordRecoveryToken = await this.passwordResetTokenRepository
            .findOne({
                where: {
                    token
                },
                order: {
                    createdAt: 'DESC'
                }
            });

        if (!passwordRecoveryToken)
            throw new TokenExpiredException("Token has expired!");

        return passwordRecoveryToken;
    }

    async checkPasswordResetCodeStatus(code: string): Promise<PasswordResetCodeStatusDto> {
        try {
            const passwordRecoveryToken = await this.getPasswordResetTokenByToken(code);

            const timestampComparison = Math.sign(passwordRecoveryToken.expiresAt.getTime() - Date.now());

            if (timestampComparison < 0)
                throw new TokenExpiredException('Token has expired');

            return { valid: true };
        } catch (Exception) {
            if (Exception instanceof TokenExpiredException)
                return { valid: false };

            throw Exception;
        }
    }

    async sendPasswordResetCode(userEmail: string) {
        const user = await this.userService.getUserByEmail(userEmail);
        const passwordResetToken = await this.createPasswordResetToken(user.id);

        const domain = this.configService.get<string>(ENV_MAILGUN_DOMAIN_NAME);
        const template = this.configService.get<string>(ENV_MAILGUN_TEMPLATE_PASSWORD_RESET)

        await this.mailerService.sendMail({
            domain,
            options: {
                from: EMAIL_FROM,
                to: userEmail,
                subject: "Password Reset - InfoCoin",
                template,
                "t:variables": JSON.stringify({ password_reset_code: passwordResetToken.token })
            }
        });
    }

    @Transactional()
    async resetPassword(dto: ResetPasswordDto) {
        const passwordResetToken = await this.getPasswordResetTokenByToken(dto.code);
        const user = await this.userService.getUserById(passwordResetToken.userId);

        const { valid } = await this.checkPasswordResetCodeStatus(dto.code);

        if (!valid)
            throw new TokenExpiredException("Token has expired!");

        await this.passwordResetTokenRepository.remove(passwordResetToken);
        await this.userService.changePassword({
            userId: user.id,
            password: dto.password,
            confirmPassword: dto.confirmPassword
        });
    }

    generateTokenCode(length: number): string {
        let code = '';

        for (let i = 0; i < length; i++) {
            let randomNumber = Math.floor(Math.random() * 9);
            code += randomNumber;
        }

        return code;
    }
}

import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfigProvider } from './config/jwt-config.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from './entities/verification-token.entity';
import { MailerModule } from '../mailer/mailer.module';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ ConfigService ],
      useClass: JwtConfigProvider
    }),
    TypeOrmModule.forFeature([
      VerificationToken,
      PasswordResetToken
    ]),
    PassportModule,
    MailerModule
  ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
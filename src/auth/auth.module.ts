import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfigProvider } from './config/jwt-config.provider';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ ConfigService ],
      useClass: JwtConfigProvider
    }),
    PassportModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
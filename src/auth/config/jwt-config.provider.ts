import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { ENV_JWT_SECRET } from "../../common/constants";

@Injectable()
export class JwtConfigProvider implements JwtOptionsFactory {
    constructor(
        private readonly configService: ConfigService
    ) {}
    
    createJwtOptions(): JwtModuleOptions {
        return {
            secret: this.configService.get<string>(ENV_JWT_SECRET),
            signOptions: { expiresIn: '1d' }
        }
    }
}
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user/services/user.service";
import { ENV_JWT_SECRET } from "../../common/constants";
import { UserPayloadDto } from "../dto/user-payload.dto";
import { SessionHasExpiredException } from "../exceptions/session-has-expired.exception";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>(ENV_JWT_SECRET)
        });
    }

    async validate({ sub, passwordId }: UserPayloadDto): Promise<User> {
        const user = await this.userService.getUserById(sub);

        if (user.passwordId !== passwordId)
            throw new SessionHasExpiredException("Session has expired");

        return user;
    }
}
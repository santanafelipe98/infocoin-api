import { UnauthorizedException } from "@nestjs/common";

export class SessionHasExpiredException extends UnauthorizedException {}
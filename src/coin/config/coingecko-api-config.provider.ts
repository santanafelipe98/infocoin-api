import { HttpModuleOptions, HttpModuleOptionsFactory } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ENV_COINGECKO_API_BASE_URL } from "../../common/constants";

@Injectable()
export class CoinGeckoApiConfigProvider implements HttpModuleOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createHttpOptions(): HttpModuleOptions {
        return {
            baseURL: this.configService.get(ENV_COINGECKO_API_BASE_URL)
        }
    }
}
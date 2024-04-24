import { Module } from '@nestjs/common';
import { CoinController } from './controllers/coin.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoinGeckoApiConfigProvider } from './config/coingecko-api-config.provider';
import { CoinGeckoService } from './services/coingecko.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './entities/coin.entity';
import { CoinService } from './services/coin.service';

@Module({
    imports: [
        HttpModule.registerAsync({
            inject: [ConfigService],
            useClass: CoinGeckoApiConfigProvider
        }),
        TypeOrmModule.forFeature([
            Coin
        ])
    ],
    controllers: [CoinController],
    providers: [
        CoinGeckoService,
        CoinService
    ],
    exports: [
        CoinService,
        CoinGeckoService
    ]
})
export class CoinModule {}

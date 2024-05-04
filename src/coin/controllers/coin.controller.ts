import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CoinGeckoService } from '../services/coingecko.service';
import { CoinGeckoReadCoinPriceDto } from '../dto/coingecko-read-coin-price.dto';
import { CoinGeckoCoinPriceDto } from '../dto/coingecko-coin-price.dto';
import { Coin } from '../entities/coin.entity';
import { CoinService } from '../services/coin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('coins')
export class CoinController {
    constructor(
        private readonly coinGeckoService: CoinGeckoService,
        private readonly coinService: CoinService
    ) {}

    @Get("price")
    async getCoinPriceByIds(@Query() dto: CoinGeckoReadCoinPriceDto): Promise<CoinGeckoCoinPriceDto> {
        return this.coinGeckoService.getCoinPriceByIds(dto);
    }

    @Get('list')
    async getCoinsList(): Promise<Coin[]> {
        return this.coinService.getCoinsList();
    }
}

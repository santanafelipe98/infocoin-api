import { Injectable } from '@nestjs/common';
import { CoinService } from '../../coin/services/coin.service';
import { CoinGeckoService } from '../../coin/services/coingecko.service';
import { UpdateCoinDto } from '../../coin/dto/update-coin.dto';

@Injectable()
export class SyncService {
    constructor(
        private readonly coinGeckoService: CoinGeckoService,
        private readonly coinService: CoinService
    ) {}

    async startSynchronization() {
        const coinsList = (await this.coinGeckoService.getCoinsList()) as UpdateCoinDto[];
        await this.coinService.updateCoinsList(coinsList);
    }
}

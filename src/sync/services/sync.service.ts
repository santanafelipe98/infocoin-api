import { Injectable, Logger } from '@nestjs/common';
import { CoinService } from '../../coin/services/coin.service';
import { CoinGeckoService } from '../../coin/services/coingecko.service';
import { UpdateCoinDto } from '../../coin/dto/update-coin.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SyncService {
    private readonly logger = new Logger(SyncService.name);

    constructor(
        private readonly coinGeckoService: CoinGeckoService,
        private readonly coinService: CoinService
    ) {}

    async startSync() {
        const coinsList = (await this.coinGeckoService.getCoinsList()) as UpdateCoinDto[];
        await this.coinService.updateCoinsList(coinsList);
    }

    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async autoSync() {
        try {
            this.logger.debug("Starting to sync");

            await this.startSync();

            this.logger.debug("Sync completed")
        } catch (Exception) {
            this.logger.error(Exception);
        }
    }
}

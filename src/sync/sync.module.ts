import { Module } from '@nestjs/common';
import { SyncService } from './services/sync.service';
import { SyncController } from './sync.controller';
import { CoinModule } from 'src/coin/coin.module';

@Module({
  imports: [CoinModule],
  providers: [SyncService],
  controllers: [SyncController]
})
export class SyncModule {}

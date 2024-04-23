import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinModule } from './coin/coin.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import typeorm from './database/config/typeorm';

@Module({
    imports: [
        CoinModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ typeorm ]
        }),
        CommonModule,
        DatabaseModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

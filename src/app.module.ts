import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinModule } from './coin/coin.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { SyncModule } from './sync/sync.module';
import { AlertModule } from './alert/alert.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { QueueModule } from './queue/queue.module';
import { ScheduleModule } from '@nestjs/schedule';
import typeorm from './database/config/typeorm';

@Module({
    imports: [
        CoinModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [ typeorm ]
        }),
        MailerModule,
        ScheduleModule.forRoot(),
        CommonModule,
        DatabaseModule,
        SyncModule,
        AlertModule,
        UserModule,
        AuthModule,
        MailerModule,
        QueueModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

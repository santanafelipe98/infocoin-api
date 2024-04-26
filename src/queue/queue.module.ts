import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_REDIS_HOST, ENV_REDIS_PORT } from '../common/constants';

@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ ConfigService ],
            useFactory: (configService: ConfigService) => {
                return {
                    redis: {
                        host: configService.get<string>(ENV_REDIS_HOST),
                        port: configService.get<number>(ENV_REDIS_PORT)
                    }
                }
            }
        })
    ]
})
export class QueueModule {}

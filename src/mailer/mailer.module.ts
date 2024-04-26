import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailgunModule } from 'nestjs-mailgun';
import { ENV_MAILGUN_API_KEY, ENV_MAILGUN_DOMAIN_NAME, ENV_MAILGUN_USERNAME, QUEUE_MAIL_SENDING } from '../common/constants';
import { MailerService } from './services/mailer.service';
import { MailSendingProcessor } from './jobs/mail-sending.processor';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        MailgunModule.forAsyncRoot({
            inject: [ ConfigService ],
            useFactory: (configService: ConfigService) => {
                return {
                    username: configService.get<string>(ENV_MAILGUN_USERNAME),
                    key: configService.get<string>(ENV_MAILGUN_API_KEY)
                }
            }
        }),
        BullModule.registerQueue({
            name: QUEUE_MAIL_SENDING
        })
    ],
    providers: [
        MailerService,
        MailSendingProcessor
    ],
    exports: [
        MailerService
    ]
})
export class MailerModule {}

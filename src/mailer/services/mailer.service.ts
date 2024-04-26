import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { JOB_MAIL_SENDING, QUEUE_MAIL_SENDING } from "../../common/constants";
import { MailSendingDto } from "../dto/mail-sending.dto";

@Injectable()
export class MailerService {
    constructor(
        @InjectQueue(QUEUE_MAIL_SENDING)
        private readonly mailSendingQueue: Queue
    ) {}

    async sendMail(dto: MailSendingDto) {
        return this.mailSendingQueue.add(JOB_MAIL_SENDING, dto, {
            removeOnComplete: true,
            removeOnFail: true,
            attempts: 3
        });
    }
}
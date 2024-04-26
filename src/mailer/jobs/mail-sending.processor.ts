import { OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { MailgunService } from "nestjs-mailgun";
import {
    JOB_MAIL_SENDING,
    QUEUE_MAIL_SENDING
} from "../../common/constants";
import { Logger } from "@nestjs/common";
import { MailSendingDto } from "../dto/mail-sending.dto";

@Processor(QUEUE_MAIL_SENDING)
export class MailSendingProcessor {
    private readonly logger: Logger = new Logger(MailSendingProcessor.name);

    constructor(
        private readonly mailgunService: MailgunService
    ) {}

    @Process(JOB_MAIL_SENDING)
    async execute(job: Job<MailSendingDto>) {
        const { data: { domain, options } } = job;

        await this.mailgunService.createEmail(domain, options);
    }

    @OnQueueFailed()
    onFail({ data }: Job<MailSendingDto>) {
        this.logger.error(`Job failed to send mail - ${JSON.stringify(data)}`);
    }

    @OnQueueCompleted()
    onCompleted({ data }: Job<MailSendingDto>) {
        this.logger.debug(`Job completed to send mail - ${JSON.stringify(data)}`);
    }
}
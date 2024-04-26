import { MailgunMessageData } from "nestjs-mailgun";

export class MailSendingDto {
    domain: string;
    options: MailgunMessageData;
}
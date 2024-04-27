import { Body, Controller, Post } from "@nestjs/common";
import { AlertService } from "../services/alert.service";
import { Alert } from "../entities/alert.entity";
import { CreateAlertDto } from "../dto/create-alert.dto";

@Controller("alerts")
export class AlertController {
    constructor(
        private readonly alertService: AlertService
    ) {}

    @Post("create")
    async createAlert(@Body() dto: CreateAlertDto): Promise<Alert> {
        return this.alertService.createAlert(dto);
    }
}
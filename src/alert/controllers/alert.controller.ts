import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AlertService } from "../services/alert.service";
import { Alert } from "../entities/alert.entity";
import { CreateAlertDto } from "../dto/create-alert.dto";
import { ReadAlertsListDto } from "../dto/read-alerts-list.dto";

@Controller("alerts")
export class AlertController {
    constructor(
        private readonly alertService: AlertService
    ) {}

    @Post("create")
    async createAlert(@Body() dto: CreateAlertDto): Promise<Alert> {
        return this.alertService.createAlert(dto);
    }

    @Get('list')
    async getAlertsList(@Query() dto: ReadAlertsListDto): Promise<Alert[]> {
        return this.alertService.getAlertsList(dto);
    }
}
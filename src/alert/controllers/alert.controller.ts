import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { AlertService } from "../services/alert.service";
import { Alert } from "../entities/alert.entity";
import { CreateAlertDto } from "../dto/create-alert.dto";
import { ReadAlertsListDto } from "../dto/read-alerts-list.dto";
import { UpdateAlertDto } from "../dto/update-alert.dto";
import { ReadAlertDto } from "../dto/read-alert.dto";

@Controller("alerts")
export class AlertController {
    constructor(
        private readonly alertService: AlertService
    ) {}

    @Post("create")
    async createAlert(@Body() dto: CreateAlertDto): Promise<Alert> {
        return this.alertService.createAlert(dto);
    }

    @Put('update/:id')
    async updateAlert(@Param() { id } : ReadAlertDto, @Body() dto: UpdateAlertDto): Promise<Alert> {
        return this.alertService.updateAlert(id, dto);
    }

    @Delete('delete/:id')
    async removeAlert(@Param() { id }: ReadAlertDto) {
        return this.alertService.removeAlert(id);
    }

    @Get('list')
    async getAlertsList(@Query() dto: ReadAlertsListDto): Promise<Alert[]> {
        return this.alertService.getAlertsList(dto);
    }

    @Get(':id')
    async getAlertById(@Param() { id }: ReadAlertDto): Promise<Alert> {
        return this.alertService.getAlertById(id);
    }
}
import { Controller, HttpCode, Post } from '@nestjs/common';
import { SyncService } from './services/sync.service';

@Controller('sync')
export class SyncController {
    constructor(
        private readonly syncService: SyncService
    ) {}

    @Post('start')
    @HttpCode(204)
    async startSynchronization() {
        return this.syncService.startSynchronization();
    }
}

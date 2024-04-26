import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  ConfigModule, ConfigService } from '@nestjs/config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => configService.get('typeorm'),
            async dataSourceFactory(options) {
                if (!options)
                    throw new Error('Invalid options passed');

                return addTransactionalDataSource(new DataSource(options))
            }
        })
    ]
})
export class DatabaseModule {}

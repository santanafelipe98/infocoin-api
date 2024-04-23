import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_PORT } from './common/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true
    }));

    const configService = app.get(ConfigService);
    const PORT          = configService.get<number>(ENV_PORT);

    await app.listen(PORT);
}
bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_PORT } from './common/constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true
    }));

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );

    const configService = app.get(ConfigService);
    const PORT          = configService.get<number>(ENV_PORT);

    await app.listen(PORT);
}
bootstrap();

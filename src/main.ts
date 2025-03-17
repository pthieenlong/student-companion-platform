import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { SwaggerConfigModule } from './modules/swagger/swagger-config.module';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
  const configService = app.get(ConfigService);
  SwaggerConfigModule.setupSwagger(app);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })

  const port = configService.get<number>('PORT');

  await app.listen(port);
  console.log(`API is running at: ${configService.get('PORT')}`);
}
bootstrap();
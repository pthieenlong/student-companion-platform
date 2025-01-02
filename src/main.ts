import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { SwaggerConfigModule } from './modules/swagger/swagger-config.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );
  const configService = app.get(ConfigService);
  SwaggerConfigModule.setupSwagger(app);

  const port = configService.get<number>('PORT');
  await app.listen(port);
  console.log(`API is running at: ${configService.get('PORT')}`);
}
bootstrap();
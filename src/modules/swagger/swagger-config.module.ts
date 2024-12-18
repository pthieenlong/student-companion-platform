import { Module } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { AppConfigModule } from '../../config/config.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
@Module({
  imports: [AppConfigModule],
})
export class SwaggerConfigModule {
  static setupSwagger(app: INestApplication): void {
    const configService = app.get(AppConfigService);

    const documentConfig = new DocumentBuilder()
      .setTitle(configService.swaggerTitle)
      .setDescription(configService.swaggerDescription)
      .setVersion(configService.swaggerVersion)
      .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup(configService.swaggerPath, app, document);
  }
}

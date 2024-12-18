import { DocumentBuilder } from "@nestjs/swagger";
import { AppConfigService } from '../config/config.service';
export const createSwaggerConfig = (configService: AppConfigService) => {
  return new DocumentBuilder()
    .setTitle(configService.swaggerTitle)
    .setDescription(configService.swaggerDescription)
    .setVersion('0.1')
    .build()
  ;
}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '../config/config.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { SwaggerModule } from '@nestjs/swagger';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule, DatabaseModule, SwaggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}

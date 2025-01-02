import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '../config/config.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user/user.module';
import { MailModule } from '../modules/mail/mail.module';
import { AppConfigService } from '../config/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { OtpModule } from 'src/modules/otp/otp.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    AppConfigModule, DatabaseModule, SwaggerModule, AuthModule, UserModule, MailModule, MailerModule, OtpModule],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {

}

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
import { OtpModule } from '../modules/otp/otp.module';
import { NoteModule } from '../modules/note/note.module';
import { TagModule } from '../modules/tag/tag.module';
import { FileModule } from '../modules/file/file.module';
import { ScheduleModule } from 'src/modules/schedule/schedule.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    AppConfigModule, DatabaseModule, SwaggerModule, AuthModule, UserModule, ScheduleModule, MailModule, MailerModule, OtpModule, NoteModule, TagModule, FileModule],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
})
export class AppModule {

}

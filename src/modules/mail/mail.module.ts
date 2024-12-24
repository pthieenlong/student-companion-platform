import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { AppConfigService } from '../../config/config.service';
import { Options } from 'nodemailer/lib/smtp-transport';
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService): MailerOptions => {
        const transport: Options = {
          host: configService.emailHost,
          port: configService.emailPort,
          secure: false,
          auth: {
            user: configService.emailUsername,
            pass: configService.emailPassword,
          },
        };
        
        return {
          transport,
        }
      }
    }),
  ],
  providers: [MailService]
})
export class MailModule {}

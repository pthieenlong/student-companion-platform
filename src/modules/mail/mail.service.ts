import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { IResponse } from '../../shared/types/CustomResponse';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly configService: AppConfigService) {}
  async sendMail(email: string, content: any): Promise<IResponse> {
    try {
      await this.mailerService.sendMail({
        from: 'Student Companion Platform <p.thieenlong.304@gmail.com>',
        to: email,
        subject: `How to Send Emails with Nodemailer`,
        text: content,
      })
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'MAIL.SEND.FAIL',
      }
    }
  }
}

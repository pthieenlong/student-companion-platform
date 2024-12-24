import { HttpStatus, Injectable } from '@nestjs/common';
import { IResponse } from 'src/shared/types/CustomResponse';

@Injectable()
export class MailService {
  async sendMail(): Promise<IResponse> {

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'MAIL.SEND.SUCCESS'
    }
  }
}

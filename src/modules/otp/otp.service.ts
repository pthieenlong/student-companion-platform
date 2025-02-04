import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as otpGenerate from 'otp-generator';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpEntity } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IResponse } from '../../shared/types/CustomResponse';
@Injectable()
export class OtpService {
  constructor(@InjectRepository(OtpEntity) private otpRepo: Repository<OtpEntity>) {
    
  }

  async generateOtp(username: string, email: string): Promise<IResponse> {
    const otp = otpGenerate.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      digits: true,
      specialChars: false,
    });
    try {
      const id = uuidv4();
      await this.otpRepo.save({ id, username, email, otp })
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'OTP.CREATE.SUCCESS',
        data: { code: otp }
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'OTP.CREATE.FAIL',
      }
    }
  }

  async findOneBy(username: string, email: string) {
    try {
      const otp = await this.otpRepo.findOneBy({ email, username, isUsed: false })
      return otp;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async activeUser(username: string, email: string): Promise<IResponse> {
    try {
      const otp = await this.otpRepo.findOneBy( { email, username, isUsed: false })
      if(!otp) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'OTP.GET.FAIL',
        }
      } else {
        otp.isUsed = true;
        await this.otpRepo.save(otp);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'OTP.ACTIVE.SUCCESS',
        }
      }
    } catch (error) {
     return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'OTP.ACTIVE.FAIL',
          errors: error
        }
    }
  }
}

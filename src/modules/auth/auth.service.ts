import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';
import { Repository } from 'typeorm';
import User from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IResponse } from '../../shared/types/CustomResponse';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Active } from '../../shared/enum/EUser';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private authRepository: Repository<User>, private configService: AppConfigService, private jwtService: JwtService, private otpService: OtpService, private readonly mailService: MailService) {
    
  }

  async register(user: Partial<User>): Promise<IResponse> {
    if(!user) 
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.REGISTER.REQUIRED'
      }
    else if(await this.authRepository.findOneBy({ username: user.username })) {
      return {
        code: HttpStatus.NOT_ACCEPTABLE,
        success: false,
        message: 'USER.REGISTER.EXISTED'
      }
    }
    else {
      try {
        user.id = uuidv4();
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        user.password = hashedPassword;

        await this.authRepository.save(user);

        return {
          code: HttpStatus.CREATED,
          success: true,
          message: 'USER.REGISTER.SUCCESS'
        }
      } 
      catch(error) {
        console.error(error);
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: error
        }
      }
    }
  }
  
  async login(account: Partial<User>): Promise<IResponse> {
    try {
      const user = await this.authRepository.findOneBy({ username: account.username });

      if(!user) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'USER.LOGIN.NOT_FOUND'
        }
      }
      const isPasswordValid = await bcrypt.compare(account.password, user.password);

      if(!isPasswordValid) {
        return {
          code: HttpStatus.NOT_ACCEPTABLE,
          success: false,
          message: 'USER.LOGIN.WRONG_PASSWORD'
        }
      } else {
        const payload = {
          info: {
            username: user.username,
            id: user.id,
            role: user.role
          },
        };
        const refreshToken = this.jwtService.sign(payload, {
          secret: this.configService.refreshToken,
          expiresIn: '30d'
        });
        const accessToken = this.jwtService.sign(payload, {
          secret: this.configService.accessToken,
          expiresIn: '15m'
        });
  
        user.token = { refreshToken, accessToken };
        await this.authRepository.save(user);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'USER.LOGIN.SUCCESS',
          data: { accessToken }
        }
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.LOGIN.FAIL',
        errors: [...error]
      }
    }
  }
  async getNewAccessToken(refreshToken: string): Promise<IResponse> {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      const newAccessToken = await this.generateAccessToken(payload.info.id);
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'USER.TOKEN.SUCCESS',
        data: { newAccessToken }
      }
    } catch(error) {
      console.log(error);
      return {
        code: HttpStatus.FORBIDDEN,
        success: false,
        message: 'USER.TOKEN.FAIL',
      }
    }
  }
  async generateAccessToken(userId: string) {
    try {
      const user = await this.authRepository.findOneBy({ id: userId });
      const payload = {
        info: {
          username: user.username,
          id: user.id,
          role: user.role
        },
      };
      return this.jwtService.sign(payload, {
        secret: this.configService.accessToken,
        expiresIn: '15m'
      });
    } catch (error) {
      console.error(error)
    }
    
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.refreshToken
    });
  }

  async sendActiveRequest(account: Partial<User>): Promise<IResponse> {
    try {
      const user = await this.authRepository.findOneBy({ username: account.username });
      if(!user) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'USER.LOGIN.NOT_FOUND'
        }
      }
      if(user.isActive === Active.ACTIVE) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'USER.ACTIVE.ACTIVED'
        }
      }
      const otp = await this.otpService.generateOtp(user.username, user.email);
      await this.mailService.sendMail(account.email, JSON.stringify(otp.data));

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'USER.SEND_REQUEST.SUCCESS',
        data: { otp }
      }
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.SEND_REQUEST.FAIL',
      }
    }
  }

  async activeUser(account: Partial<User>, otp: string): Promise<IResponse> {
    try {
      const user = await this.authRepository.findOneBy({ username: account.username });
      if(!user) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'USER.LOGIN.NOT_FOUND'
        }
      }
      if(user.isActive === Active.ACTIVE) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'USER.ACTIVE.ACTIVED'
        }
      }

      const userOtp = await this.otpService.findOneBy(account.username, account.email);
      if(otp !== userOtp.otp) {
        return {
          code: HttpStatus.NOT_ACCEPTABLE,
          success: false,
          message: 'USER.ACTIVE.MISSING.OTP'
        }
      } else {
        user.isActive = Active.ACTIVE;
        await this.authRepository.save(user);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'USER.ACTIVE.SUCCESS'
        }
      }

    } catch (error) {
      error
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.ACTIVE.FAIL'
      }
    }
  }

}

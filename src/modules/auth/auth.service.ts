import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';
import { Repository } from 'typeorm';
import User from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IResponse } from '../../shared/types/CustomResponse';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private authRepository: Repository<User>, private configService: AppConfigService, private jwtService: JwtService) {
    
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
            id: user.id
          },
        };
        const refreshToken = this.jwtService.sign(payload, {
          secret: this.configService.refreshToken,
          expiresIn: '30d'
        });
        const accessToken = this.jwtService.sign(payload, {
          secret: this.configService.accessToken,
          expiresIn: '1h'
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

}

import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IResponse } from '../../shared/types/CustomResponse';
import { RegisterDTO, LoginDTO } from './DTO/auth.dto';
import { CustomRequest } from '../../common/interceptors/customRequest.interceptor';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { VerifyUserGuard } from 'src/common/guards/auth/verify-user.guard';
import { response, Response } from 'express';
import { AppConfigService } from 'src/config/config.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: AppConfigService) {}

  @CustomRequest(RegisterDTO)
  @Post('/register')
  create(@Body() body: RegisterDTO): Promise<IResponse> {
    const user = {
      username: body.username,
      password: body.password,
      confirmPassword: body.confirmPassword,
      email: body.email,
      phoneNumber: body.phoneNumber,
      fullName: body.fullName
    }
    return this.authService.register(user);
  }

  @CustomRequest(LoginDTO)
  @Post('/signin')
  async login(@Body() body: LoginDTO, @Res({ passthrough: true}) res: Response): Promise<IResponse> {
    const requestUser = {
      username: body.username,
      password: body.password
    }
    const responseUser = await this.authService.login(requestUser); 
    if(responseUser.success) {
      res.cookie('accessToken', responseUser.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
    }
    return { ...responseUser, data: { ...responseUser.data, accessToken: null } };
  }

  @Get('/generate-token')  
  async getAccessToken(@Body('refreshToken') refreshToken: string): Promise<IResponse> {
    return this.authService.getNewAccessToken(refreshToken);
  }

  @UseGuards(AuthGuard, VerifyUserGuard)
  @Post('/active-request')
  async sendActiveRequest(@Body() body): Promise<IResponse> {
    const account = {
      username: body.username,
      email: body.email
    }

    return this.authService.sendActiveRequest(account);
  }

  @Post('/active-user')
  async activeUser(@Body() body): Promise<IResponse> {
    const account = {
      username: body.username,
      email: body.email
    }
    const otp = body.otp;
    
    return this.authService.activeUser(account, otp);
  }
}

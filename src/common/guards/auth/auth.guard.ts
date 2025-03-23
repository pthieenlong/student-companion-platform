import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CustomRequest from '../../../shared/types/CustomRequest';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: AppConfigService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if(!token) {
      throw new HttpException(
        'USER.LOGIN.NOT_FOUND',
        HttpStatus.UNAUTHORIZED
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.accessToken
      });
      request['token'] = payload;
    } catch {
      console.log('UNAUTHORIZED');
      
      throw new HttpException(
              'USER.LOGIN.NOT_FOUND',
              HttpStatus.UNAUTHORIZED
            );
    }
    return true;
  }

  public extractTokenFromCookie(request: CustomRequest): string | undefined {
    return request.cookies.accessToken;
  }
}

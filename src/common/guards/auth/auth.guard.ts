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
    const token = this.extractTokenFromRequest(request);
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
      console.log(request['token']);
    } catch {
      throw new HttpException(
              'USER.LOGIN.NOT_FOUND',
              HttpStatus.UNAUTHORIZED
            );
    }
    return true;
  }

  public extractTokenFromRequest(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

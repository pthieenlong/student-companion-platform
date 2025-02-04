import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class VerifyUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.token;
    if(request.params.username === user.info.username || request.body.username === user.info.username) {
      return true;
    }
    else {
      throw new HttpException(
        'USER.LOGIN.NOT_FOUND',
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}

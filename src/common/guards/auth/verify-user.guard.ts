import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class VerifyUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.token;
    if(request.params.username === user.info.username) 
      return true;
    else {
      
      throw new UnauthorizedException();
    }
  }
}

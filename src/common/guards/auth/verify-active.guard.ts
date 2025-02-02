import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Active } from 'src/shared/enum/EUser';

@Injectable()
export class VerifyActiveGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.token;
    if(user.info.active == Active.ACTIVE) {
      return true;
    } else {
      throw new HttpException(
        'USER.ACTIVE.NOT_FOUND',
        HttpStatus.NOT_ACCEPTABLE
      )
    }
  }
}

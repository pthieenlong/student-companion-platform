import { CanActivate, ExecutionContext, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../../../shared/enum/EUser';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
 
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if(!requiredRoles) {
      throw new ForbiddenException({
        code: HttpStatus.FORBIDDEN,
        success: false,
        message: 'USER.ROLE.REQUIRED',
      })
    }
    const request = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.some((role) => request.token?.info?.role?.includes(role));
    if(!hasRole) {
      throw new ForbiddenException({
        code: HttpStatus.FORBIDDEN,
        success: false,
        message: 'USER.ROLE.REQUIRED',
      })
    } else return true;
  }
}

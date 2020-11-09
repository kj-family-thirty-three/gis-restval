import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<string[]>('roles', context.getHandler());

    // console.log('ROLES: ', roles);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user.company_admin ? 'admin' : 'user';
    return this.matchRoles(roles, userRole);
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }
}

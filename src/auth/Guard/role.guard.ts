import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {    //No roles are required!!
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user=request.user
    
    console.log(user);
    if (!user || !user.role) {
        return false;  // If user or role is undefined, deny access
    }
   
    

    return requiredRoles.includes(user.role);
  }
}
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const role = req.token.role;

    const allowedToRoles = this.reflector.get<('administrator' | 'customer')[]>(
      'allow_to_roles',
      context.getHandler(),
    );

    if (!allowedToRoles.includes(role)) {
      return false;
    }

    return true;
  }
}

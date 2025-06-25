import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

interface JwtPayload {
  id: number;
  nombre: string;
  rol: string;
  telefono: string;
  acceso: string;
}

@Injectable()
export class RolesGuardia implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No se requiere rol específico
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user as JwtPayload;

    if (!user || !user.rol) {
      throw new ForbiddenException('Usuario no autenticado o sin rol');
    }

    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}

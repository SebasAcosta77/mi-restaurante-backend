import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  nombre: string;
  rol: string;
  telefono: string;
  acceso: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    let token = request.headers['authorization'];

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Token no proporcionado o malformado');
    }

    // ✅ Permitir tanto con "Bearer" como sin él
    if (token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '').trim();
    }

    try {
      const payload = verify(token, 'laClaveSuperSecreta') as JwtPayload;
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

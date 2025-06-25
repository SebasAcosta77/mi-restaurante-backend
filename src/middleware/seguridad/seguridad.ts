import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class Seguridad implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

   
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim() // elimina "Bearer 
      : authHeader.trim();

    try {
      const datosSesion = verify(token, 'laClaveSuperSecreta');

      if (req.method !== 'PUT') {
        req.body.datosUsuario = datosSesion;
      }

      next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token inválido o intento de fraude' });
    }
  }
}

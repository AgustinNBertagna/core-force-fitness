import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const dateTime: Date = new Date();
    const date: string = dateTime.toLocaleDateString();
    const time: string = dateTime.toLocaleTimeString();
    console.log(
      `Se esta ejecutando un metodo ${req.method} en la ruta ${req.url} hora ${time} y fecha ${date}`,
    );
    next();
  }
}

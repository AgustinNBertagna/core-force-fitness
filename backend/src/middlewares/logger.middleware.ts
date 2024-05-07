import { NextFunction, Request, Response } from 'express';

export function LoggerMiddlwareGlobal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const date = new Date();
  const formatDate =
    date.getFullYear() +
    '-' +
    (Number(date.getMonth()) + 1) +
    '-' +
    date.getDay();
  const formatTime = date.getHours() + ':' + date.getMinutes();
  console.log(
    `Se esta ejecutando un metodo ${req.method} en la ruta ${req.url} hora ${formatTime} y fecha ${formatDate}`,
  );
  next();
}

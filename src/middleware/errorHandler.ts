import type { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(error);
  res.status(500).json({ mensaje: 'Ocurrió un error interno en el servidor.' });
}

export function rutaNoEncontrada(_req: Request, res: Response): void {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
}

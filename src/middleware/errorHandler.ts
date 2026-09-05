import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      exito: false,
      mensaje: error.message,
      ...(error.detalles ? { errores: error.detalles } : {}),
    });
    return;
  }
  console.error(error);
  res.status(500).json({ exito: false, mensaje: 'Ocurrió un error interno en el servidor.' });
}

export function rutaNoEncontrada(req: Request, res: Response): void {
  res.status(404).json({
    exito: false,
    mensaje: `No existe una ruta para ${req.method} ${req.originalUrl}.`,
  });
}

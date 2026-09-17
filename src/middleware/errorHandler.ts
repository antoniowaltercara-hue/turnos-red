import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      exito: false,
      mensaje: error.message,
      ...(error.detalles ? { errores: error.detalles } : {}),
    });
  }
  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    return res.status(400).json({ exito: false, mensaje: 'El cuerpo debe contener JSON válido.' });
  }
  console.error(error);
  return res
    .status(500)
    .json({ exito: false, mensaje: 'Ocurrió un error interno en el servidor.' });
}

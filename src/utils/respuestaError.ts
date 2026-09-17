import { ApiError } from '../errors/ApiError.js';

export function respuestaError(error: unknown, status: number) {
  if (error instanceof ApiError) {
    return {
      exito: false,
      mensaje: error.message,
      ...(error.detalles ? { errores: error.detalles } : {}),
    };
  }
  return {
    exito: false,
    mensaje:
      status < 500 && error instanceof Error
        ? error.message
        : 'Ocurrió un error interno en el servidor.',
  };
}

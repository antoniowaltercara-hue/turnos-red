import type { Request, Response } from 'express';

export class GeneralController {
  bienvenida = async (_req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      status = 200;
      return res
        .status(status)
        .json({ exito: true, mensaje: 'Hello World! Bienvenido a TurnosRed.' });
    } catch {
      status = 500;
      return res
        .status(status)
        .json({ exito: false, mensaje: 'Ocurrió un error interno en el servidor.' });
    }
  };

  rutaNoEncontrada = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      status = 404;
      throw new Error(`No existe una ruta para ${req.method} ${req.originalUrl}.`);
    } catch (error) {
      return res
        .status(status)
        .json({
          exito: false,
          mensaje:
            error instanceof Error && status === 404
              ? error.message
              : 'Ocurrió un error interno en el servidor.',
        });
    }
  };
}

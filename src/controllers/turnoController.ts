import type { Request, Response } from 'express';
import type { TurnoCrudo } from '../models/turno.js';
import type { TurnoService } from '../services/turnoService.js';
import { ApiError } from '../errors/ApiError.js';
import { idPositivo } from '../utils/validaciones.js';

export class TurnoController {
  constructor(private readonly service: TurnoService) {}

  listar = async (_req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const datos = await this.service.obtenerTodos();
      status = 200;
      return res.status(status).json(datos);
    } catch (error) {
      if (error instanceof ApiError) status = error.status;
      else if (
        error instanceof Error &&
        (error.message.includes('válid') || error.message === 'Ya existe un turno con ese ID.')
      )
        status = 400;
      return res
        .status(status)
        .json({
          mensaje:
            status < 500 && error instanceof Error
              ? error.message
              : 'Ocurrió un error interno en el servidor.',
        });
    }
  };

  obtener = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const id = idPositivo(req.params.id);
      const datos = await this.service.obtenerPorId(id);
      if (!datos) {
        status = 404;
        throw new Error('Turno no encontrado.');
      }
      status = 200;
      return res.status(status).json(datos);
    } catch (error) {
      if (error instanceof ApiError) status = error.status;
      else if (
        error instanceof Error &&
        (error.message.includes('válid') || error.message === 'Ya existe un turno con ese ID.')
      )
        status = 400;
      return res
        .status(status)
        .json({
          mensaje:
            status < 500 && error instanceof Error
              ? error.message
              : 'Ocurrió un error interno en el servidor.',
        });
    }
  };

  crear = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        status = 400;
        throw new Error('Los datos del turno no son válidos.');
      }
      const datos = await this.service.crear(req.body as TurnoCrudo);
      status = 201;
      return res.status(status).json(datos);
    } catch (error) {
      if (error instanceof ApiError) status = error.status;
      else if (
        error instanceof Error &&
        (error.message.includes('válid') || error.message === 'Ya existe un turno con ese ID.')
      )
        status = 400;
      return res
        .status(status)
        .json({
          mensaje:
            status < 500 && error instanceof Error
              ? error.message
              : 'Ocurrió un error interno en el servidor.',
        });
    }
  };

  actualizar = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const id = idPositivo(req.params.id);
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        status = 400;
        throw new Error('Los datos del turno no son válidos.');
      }
      const datos = await this.service.actualizar(id, req.body as TurnoCrudo);
      if (!datos) {
        status = 404;
        throw new Error('Turno no encontrado.');
      }
      status = 200;
      return res.status(status).json(datos);
    } catch (error) {
      if (error instanceof ApiError) status = error.status;
      else if (
        error instanceof Error &&
        (error.message.includes('válid') || error.message === 'Ya existe un turno con ese ID.')
      )
        status = 400;
      return res
        .status(status)
        .json({
          mensaje:
            status < 500 && error instanceof Error
              ? error.message
              : 'Ocurrió un error interno en el servidor.',
        });
    }
  };

  eliminar = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const id = idPositivo(req.params.id);
      const datos = await this.service.eliminar(id);
      if (!datos) {
        status = 404;
        throw new Error('Turno no encontrado.');
      }
      status = 200;
      return res.status(status).json({ mensaje: 'Turno eliminado correctamente.', turno: datos });
    } catch (error) {
      if (error instanceof ApiError) status = error.status;
      else if (
        error instanceof Error &&
        (error.message.includes('válid') || error.message === 'Ya existe un turno con ese ID.')
      )
        status = 400;
      return res
        .status(status)
        .json({
          mensaje:
            status < 500 && error instanceof Error
              ? error.message
              : 'Ocurrió un error interno en el servidor.',
        });
    }
  };
}

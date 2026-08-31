import type { NextFunction, Request, Response } from 'express';
import type { TurnoCrudo } from '../models/turno.js';
import type { TurnoService } from '../services/turnoService.js';

function idValido(valor: unknown): number | null {
  if (Array.isArray(valor)) return null;
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export class TurnoController {
  constructor(private readonly service: TurnoService) {}

  listar = (_req: Request, res: Response): void => {
    res.status(200).json(this.service.obtenerTodos());
  };

  obtener = (req: Request, res: Response): void => {
    const id = idValido(req.params.id ?? '');
    if (!id) {
      res.status(400).json({ mensaje: 'El ID debe ser un número entero positivo.' });
      return;
    }
    const turno = this.service.obtenerPorId(id);
    if (!turno) {
      res.status(404).json({ mensaje: 'Turno no encontrado.' });
      return;
    }
    res.status(200).json(turno);
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const turno = await this.service.crear(req.body as TurnoCrudo);
      res.status(201).json(turno);
    } catch (error) {
      if (error instanceof Error && error.message.includes('válid')) {
        res.status(400).json({ mensaje: error.message });
        return;
      }
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = idValido(req.params.id ?? '');
    if (!id) {
      res.status(400).json({ mensaje: 'El ID debe ser un número entero positivo.' });
      return;
    }
    try {
      const turno = await this.service.actualizar(id, req.body as TurnoCrudo);
      if (!turno) {
        res.status(404).json({ mensaje: 'Turno no encontrado.' });
        return;
      }
      res.status(200).json(turno);
    } catch (error) {
      if (error instanceof Error && error.message.includes('válid')) {
        res.status(400).json({ mensaje: error.message });
        return;
      }
      next(error);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = idValido(req.params.id ?? '');
    if (!id) {
      res.status(400).json({ mensaje: 'El ID debe ser un número entero positivo.' });
      return;
    }
    try {
      const turno = await this.service.eliminar(id);
      if (!turno) {
        res.status(404).json({ mensaje: 'Turno no encontrado.' });
        return;
      }
      res.status(200).json({ mensaje: 'Turno eliminado correctamente.', turno });
    } catch (error) {
      next(error);
    }
  };
}

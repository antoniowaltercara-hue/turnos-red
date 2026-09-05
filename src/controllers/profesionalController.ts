import type { NextFunction, Request, Response } from 'express';
import type { ProfesionalService } from '../services/profesionalService.js';
import { idPositivo } from '../utils/validaciones.js';

export class ProfesionalController {
  constructor(private readonly service: ProfesionalService) {}

  listar = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({ exito: true, datos: this.service.obtenerTodos() });
    } catch (error) {
      next(error);
    }
  };

  obtener = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.obtenerPorId(idPositivo(req.params.id, 'medicoId'));
      res.status(200).json({ exito: true, datos });
    } catch (error) {
      next(error);
    }
  };

  crear = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.crear(req.body);
      console.clear();
      console.log('Profesionales después del alta:');
      console.table(this.service.obtenerTodos());
      res.status(201).json({ exito: true, mensaje: 'Profesional creado.', datos });
    } catch (error) {
      next(error);
    }
  };

  actualizar = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.actualizar(idPositivo(req.params.id, 'medicoId'), req.body);
      console.clear();
      console.log('Profesionales después de la actualización:');
      console.table(this.service.obtenerTodos());
      res.status(200).json({ exito: true, mensaje: 'Profesional actualizado.', datos });
    } catch (error) {
      next(error);
    }
  };

  eliminar = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.eliminar(idPositivo(req.params.id, 'medicoId'));
      console.clear();
      console.log('Profesionales después de la baja lógica:');
      console.table(this.service.obtenerTodos());
      res.status(200).json({ exito: true, mensaje: 'Profesional desactivado.', datos });
    } catch (error) {
      next(error);
    }
  };
}

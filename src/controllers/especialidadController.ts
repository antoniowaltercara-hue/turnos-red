import type { NextFunction, Request, Response } from 'express';
import type { EspecialidadService } from '../services/especialidadService.js';
import { idPositivo } from '../utils/validaciones.js';

export class EspecialidadController {
  constructor(private readonly service: EspecialidadService) {}

  listar = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({ exito: true, datos: this.service.obtenerTodas() });
    } catch (error) {
      next(error);
    }
  };

  obtener = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.obtenerPorId(idPositivo(req.params.id, 'especialidadId'));
      res.status(200).json({ exito: true, datos });
    } catch (error) {
      next(error);
    }
  };

  crear = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.crear(req.body);
      console.clear();
      console.log('Especialidades después del alta:');
      console.table(this.service.obtenerTodas());
      res.status(201).json({ exito: true, mensaje: 'Especialidad creada.', datos });
    } catch (error) {
      next(error);
    }
  };

  eliminar = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datos = this.service.eliminar(idPositivo(req.params.id, 'especialidadId'));
      console.clear();
      console.log('Especialidades después de la baja lógica:');
      console.table(this.service.obtenerTodas());
      res.status(200).json({ exito: true, mensaje: 'Especialidad desactivada.', datos });
    } catch (error) {
      next(error);
    }
  };
}

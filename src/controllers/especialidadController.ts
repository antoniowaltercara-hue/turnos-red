import type { Request, Response } from 'express';
import type { EspecialidadService } from '../services/especialidadService.js';
import { idPositivo, validarEspecialidad } from '../utils/validaciones.js';

import { ApiError } from '../errors/ApiError.js';
import { respuestaError } from '../utils/respuestaError.js';

export class EspecialidadController {
  constructor(private readonly service: EspecialidadService) {}

  listar = async (_req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const datos = await this.service.obtenerTodas();
      status = 200;
      return res.status(status).json({ exito: true, datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };

  obtener = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const datos = await this.service.obtenerPorId(idPositivo(req.params.id, 'especialidadId'));
      status = 200;
      return res.status(status).json({ exito: true, datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };

  crear = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        status = 400;
        throw new Error('El cuerpo debe ser un objeto JSON con los campos obligatorios.');
      }
      const entrada = validarEspecialidad(req.body);
      const datos = await this.service.crear(entrada);
      console.clear();
      console.log('Especialidades después del alta:');
      console.table(this.service.obtenerTodas());
      status = 201;
      return res.status(status).json({ exito: true, mensaje: 'Especialidad creada.', datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };

  eliminar = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const datos = await this.service.eliminar(idPositivo(req.params.id, 'especialidadId'));
      console.clear();
      console.log('Especialidades después de la baja lógica:');
      console.table(this.service.obtenerTodas());
      status = 200;
      return res.status(status).json({ exito: true, mensaje: 'Especialidad desactivada.', datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };
}

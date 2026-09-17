import type { Request, Response } from 'express';
import type { ProfesionalService } from '../services/profesionalService.js';
import { idPositivo, validarProfesional } from '../utils/validaciones.js';

import { ApiError } from '../errors/ApiError.js';
import { respuestaError } from '../utils/respuestaError.js';

export class ProfesionalController {
  constructor(private readonly service: ProfesionalService) {}

  listar = async (_req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const datos = await this.service.obtenerTodos();
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
      const datos = await this.service.obtenerPorId(idPositivo(req.params.id, 'medicoId'));
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
      const entrada = validarProfesional(req.body);
      const datos = await this.service.crear(entrada);
      console.clear();
      console.log('Profesionales después del alta:');
      console.table(this.service.obtenerTodos());
      status = 201;
      return res.status(status).json({ exito: true, mensaje: 'Profesional creado.', datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };

  actualizar = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const id = idPositivo(req.params.id, 'medicoId');
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        status = 400;
        throw new Error('El cuerpo debe ser un objeto JSON con los campos obligatorios.');
      }
      const entrada = validarProfesional(req.body);
      const datos = await this.service.actualizar(id, entrada);
      console.clear();
      console.log('Profesionales después de la actualización:');
      console.table(this.service.obtenerTodos());
      status = 200;
      return res.status(status).json({ exito: true, mensaje: 'Profesional actualizado.', datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };

  eliminar = async (req: Request, res: Response): Promise<Response> => {
    let status = 500;
    try {
      const datos = await this.service.eliminar(idPositivo(req.params.id, 'medicoId'));
      console.clear();
      console.log('Profesionales después de la baja lógica:');
      console.table(this.service.obtenerTodos());
      status = 200;
      return res.status(status).json({ exito: true, mensaje: 'Profesional desactivado.', datos });
    } catch (error) {
      status = error instanceof ApiError ? error.status : status === 400 ? 400 : 500;
      return res.status(status).json(respuestaError(error, status));
    }
  };
}

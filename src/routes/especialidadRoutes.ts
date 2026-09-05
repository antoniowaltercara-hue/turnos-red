import { Router } from 'express';
import type { EspecialidadController } from '../controllers/especialidadController.js';

export function crearEspecialidadRouter(controller: EspecialidadController): Router {
  const router = Router();
  router.get('/', controller.listar);
  router.get('/:id', controller.obtener);
  router.post('/', controller.crear);
  router.delete('/:id', controller.eliminar);
  return router;
}

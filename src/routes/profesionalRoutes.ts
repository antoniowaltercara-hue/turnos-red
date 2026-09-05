import { Router } from 'express';
import type { ProfesionalController } from '../controllers/profesionalController.js';

export function crearProfesionalRouter(controller: ProfesionalController): Router {
  const router = Router();
  router.get('/', controller.listar);
  router.get('/:id', controller.obtener);
  router.post('/', controller.crear);
  router.put('/:id', controller.actualizar);
  router.delete('/:id', controller.eliminar);
  return router;
}

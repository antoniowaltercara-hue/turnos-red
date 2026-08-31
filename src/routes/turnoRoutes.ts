import { Router } from 'express';
import type { TurnoController } from '../controllers/turnoController.js';

export function crearTurnoRouter(controller: TurnoController): Router {
  const router = Router();
  router.get('/', controller.listar);
  router.get('/:id', controller.obtener);
  router.post('/', controller.crear);
  router.put('/:id', controller.actualizar);
  router.delete('/:id', controller.eliminar);
  return router;
}

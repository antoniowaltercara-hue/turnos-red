import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { TurnoController } from './controllers/turnoController.js';
import { errorHandler, rutaNoEncontrada } from './middleware/errorHandler.js';
import { crearTurnoRouter } from './routes/turnoRoutes.js';
import type { TurnoService } from './services/turnoService.js';

export function crearApp(service: TurnoService) {
  const app = express();
  const controller = new TurnoController(service);

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.resolve(process.cwd(), 'public')));
  app.get('/salud', (_req, res) => res.status(200).json({ estado: 'ok' }));
  app.use('/turnos', crearTurnoRouter(controller));
  app.use(rutaNoEncontrada);
  app.use(errorHandler);
  return app;
}

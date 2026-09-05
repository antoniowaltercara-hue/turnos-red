import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { EspecialidadController } from './controllers/especialidadController.js';
import { ProfesionalController } from './controllers/profesionalController.js';
import { TurnoController } from './controllers/turnoController.js';
import { errorHandler, rutaNoEncontrada } from './middleware/errorHandler.js';
import { crearEspecialidadRouter } from './routes/especialidadRoutes.js';
import { crearProfesionalRouter } from './routes/profesionalRoutes.js';
import { crearTurnoRouter } from './routes/turnoRoutes.js';
import type { EspecialidadService } from './services/especialidadService.js';
import type { ProfesionalService } from './services/profesionalService.js';
import type { TurnoService } from './services/turnoService.js';

export function crearApp(
  service: TurnoService,
  especialidades?: EspecialidadService,
  profesionales?: ProfesionalService,
) {
  const app = express();
  const controller = new TurnoController(service);

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.resolve(process.cwd(), 'public')));
  app.get('/salud', (_req, res) => res.status(200).json({ estado: 'ok' }));
  app.use('/turnos', crearTurnoRouter(controller));
  if (especialidades && profesionales) {
    app.use('/especialidades', crearEspecialidadRouter(new EspecialidadController(especialidades)));
    app.use('/profesionales', crearProfesionalRouter(new ProfesionalController(profesionales)));
  }
  app.use(rutaNoEncontrada);
  app.use(errorHandler);
  return app;
}

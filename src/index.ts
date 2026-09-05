import { env } from './config/env.js';
import { crearServidor } from './server.js';
import { EspecialidadService } from './services/especialidadService.js';
import { ProfesionalService } from './services/profesionalService.js';
import { TurnoService } from './services/turnoService.js';

async function iniciar(): Promise<void> {
  console.clear();
  const service = new TurnoService(env.dataFile);
  const especialidades = new EspecialidadService(env.especialidadesFile);
  const profesionales = new ProfesionalService(env.profesionalesFile, especialidades);
  const [resultado] = await Promise.all([
    service.cargar(),
    especialidades.cargar(),
    profesionales.cargar(),
  ]);
  console.log(`Registros aceptados: ${resultado.aceptados}`);
  console.log(`Registros rechazados: ${resultado.rechazados}`);
  console.log(`Especialidades cargadas: ${especialidades.obtenerTodas().length}`);
  console.log(`Profesionales cargados: ${profesionales.obtenerTodos().length}`);

  const { httpServer } = crearServidor(service, especialidades, profesionales);
  httpServer.listen(env.port, () => {
    console.log(`TurnosRed disponible en http://localhost:${env.port}`);
  });
}

iniciar().catch((error) => {
  console.error('No se pudo iniciar TurnosRed:', error);
  process.exitCode = 1;
});

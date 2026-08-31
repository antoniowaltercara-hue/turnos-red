import { env } from './config/env.js';
import { crearServidor } from './server.js';
import { TurnoService } from './services/turnoService.js';

async function iniciar(): Promise<void> {
  const service = new TurnoService(env.dataFile);
  const resultado = await service.cargar();
  console.log(`Registros aceptados: ${resultado.aceptados}`);
  console.log(`Registros rechazados: ${resultado.rechazados}`);

  const { httpServer } = crearServidor(service);
  httpServer.listen(env.port, () => {
    console.log(`TurnosRed disponible en http://localhost:${env.port}`);
  });
}

iniciar().catch((error) => {
  console.error('No se pudo iniciar TurnosRed:', error);
  process.exitCode = 1;
});

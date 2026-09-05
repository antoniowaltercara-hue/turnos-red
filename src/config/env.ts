import 'dotenv/config';
import path from 'node:path';

const puerto = Number(process.env.PORT ?? 3000);

export const env = {
  port: Number.isInteger(puerto) && puerto > 0 ? puerto : 3000,
  dataFile: path.resolve(process.cwd(), process.env.DATA_FILE ?? './src/data/turnos.json'),
  especialidadesFile: path.resolve(
    process.cwd(),
    process.env.ESPECIALIDADES_FILE ?? './src/data/especialidades.json',
  ),
  profesionalesFile: path.resolve(
    process.cwd(),
    process.env.PROFESIONALES_FILE ?? './src/data/profesionales.json',
  ),
};

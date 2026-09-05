import { ApiError } from '../errors/ApiError.js';
import type { Especialidad, EspecialidadEntrada } from '../models/especialidad.js';
import { validarEspecialidad } from '../utils/validaciones.js';
import { cargarArreglo } from './cargarDatos.js';

export class EspecialidadService {
  private especialidades: Especialidad[] = [];

  constructor(private readonly archivo: string) {}

  async cargar(): Promise<void> {
    this.especialidades = await cargarArreglo<Especialidad>(this.archivo);
  }

  obtenerTodas(): Especialidad[] {
    return this.especialidades.map((item) => ({ ...item }));
  }

  obtenerPorId(especialidadId: number): Especialidad {
    const especialidad = this.especialidades.find((item) => item.especialidadId === especialidadId);
    if (!especialidad) throw new ApiError(404, 'Especialidad no encontrada.');
    return { ...especialidad };
  }

  obtenerActivaPorId(especialidadId: number): Especialidad {
    const especialidad = this.obtenerPorId(especialidadId);
    if (!especialidad.activa) throw new ApiError(400, 'La especialidad indicada no está activa.');
    return especialidad;
  }

  crear(entrada: EspecialidadEntrada): Especialidad {
    const datos = validarEspecialidad(entrada);
    const repetida = this.especialidades.some(
      (item) => item.nombre.toLowerCase() === datos.nombre.toLowerCase() && item.activa,
    );
    if (repetida) throw new ApiError(400, 'Ya existe una especialidad activa con ese nombre.');

    const especialidad: Especialidad = {
      especialidadId: Math.max(0, ...this.especialidades.map((item) => item.especialidadId)) + 1,
      ...datos,
      activa: true,
    };
    this.especialidades.push(especialidad);
    return { ...especialidad };
  }

  eliminar(especialidadId: number): Especialidad {
    const indice = this.especialidades.findIndex((item) => item.especialidadId === especialidadId);
    if (indice === -1) throw new ApiError(404, 'Especialidad no encontrada.');
    const actual = this.especialidades[indice];
    if (!actual) throw new ApiError(404, 'Especialidad no encontrada.');
    const eliminada = { ...actual, activa: false };
    this.especialidades[indice] = eliminada;
    return { ...eliminada };
  }
}

import { ApiError } from '../errors/ApiError.js';
import type { Profesional, ProfesionalEntrada } from '../models/profesional.js';
import { validarProfesional } from '../utils/validaciones.js';
import { cargarArreglo } from './cargarDatos.js';
import type { EspecialidadService } from './especialidadService.js';

export class ProfesionalService {
  private profesionales: Profesional[] = [];

  constructor(
    private readonly archivo: string,
    private readonly especialidades: EspecialidadService,
  ) {}

  async cargar(): Promise<void> {
    this.profesionales = await cargarArreglo<Profesional>(this.archivo);
  }

  obtenerTodos(): Profesional[] {
    return this.profesionales.map((item) => ({ ...item }));
  }

  obtenerPorId(medicoId: number): Profesional {
    const profesional = this.profesionales.find((item) => item.medicoId === medicoId);
    if (!profesional) throw new ApiError(404, 'Profesional no encontrado.');
    return { ...profesional };
  }

  crear(entrada: ProfesionalEntrada): Profesional {
    const datos = validarProfesional(entrada);
    this.especialidades.obtenerActivaPorId(datos.especialidadId);
    this.validarMatricula(datos.matricula);
    const profesional: Profesional = {
      medicoId: Math.max(0, ...this.profesionales.map((item) => item.medicoId)) + 1,
      ...datos,
      activo: true,
    };
    this.profesionales.push(profesional);
    return { ...profesional };
  }

  actualizar(medicoId: number, entrada: ProfesionalEntrada): Profesional {
    const indice = this.profesionales.findIndex((item) => item.medicoId === medicoId);
    if (indice === -1) throw new ApiError(404, 'Profesional no encontrado.');
    const actual = this.profesionales[indice];
    if (!actual) throw new ApiError(404, 'Profesional no encontrado.');
    const datos = validarProfesional(entrada);
    this.especialidades.obtenerActivaPorId(datos.especialidadId);
    this.validarMatricula(datos.matricula, medicoId);
    const actualizado: Profesional = { medicoId, ...datos, activo: actual.activo };
    this.profesionales[indice] = actualizado;
    return { ...actualizado };
  }

  eliminar(medicoId: number): Profesional {
    const indice = this.profesionales.findIndex((item) => item.medicoId === medicoId);
    if (indice === -1) throw new ApiError(404, 'Profesional no encontrado.');
    const actual = this.profesionales[indice];
    if (!actual) throw new ApiError(404, 'Profesional no encontrado.');
    const eliminado = { ...actual, activo: false };
    this.profesionales[indice] = eliminado;
    return { ...eliminado };
  }

  private validarMatricula(matricula: string, medicoId?: number): void {
    const repetida = this.profesionales.some(
      (item) => item.matricula === matricula && item.medicoId !== medicoId,
    );
    if (repetida) throw new ApiError(400, 'La matrícula ya está registrada.');
  }
}

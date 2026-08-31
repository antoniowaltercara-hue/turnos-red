import { readFile, writeFile } from 'node:fs/promises';
import type { Turno, TurnoCrudo } from '../models/turno.js';
import { normalizarTurno } from '../utils/normalizarTurno.js';
import { eventBus, EVENTOS_INTERNOS } from '../events/eventBus.js';

export class TurnoService {
  private turnos: Turno[] = [];

  constructor(private readonly archivo: string) {}

  async cargar(): Promise<{ aceptados: number; rechazados: number }> {
    try {
      const contenido = await readFile(this.archivo, 'utf8');
      const crudos = JSON.parse(contenido) as TurnoCrudo[];
      const normalizados = crudos.map(normalizarTurno);
      this.turnos = normalizados.filter((turno): turno is Turno => turno !== null);
      return { aceptados: this.turnos.length, rechazados: crudos.length - this.turnos.length };
    } catch (error) {
      console.error('No se pudo leer el archivo de turnos:', error);
      throw new Error('No fue posible cargar los datos iniciales.');
    }
  }

  obtenerTodos(): Turno[] {
    return [...this.turnos];
  }

  obtenerPorId(id: number): Turno | undefined {
    return this.turnos.find((turno) => turno.id === id);
  }

  async crear(datos: TurnoCrudo): Promise<Turno> {
    const idSugerido = datos.id ?? this.siguienteId();
    const turno = normalizarTurno({ ...datos, id: idSugerido });
    if (!turno) throw new Error('Los datos del turno no son válidos.');
    if (this.obtenerPorId(turno.id)) throw new Error('Ya existe un turno con ese ID.');
    this.turnos.push(turno);
    await this.guardar();
    eventBus.emit(EVENTOS_INTERNOS.creado, turno);
    return turno;
  }

  async actualizar(id: number, datos: TurnoCrudo): Promise<Turno | null> {
    const posicion = this.turnos.findIndex((turno) => turno.id === id);
    if (posicion === -1) return null;
    const turno = normalizarTurno({ ...datos, id });
    if (!turno) throw new Error('Los datos del turno no son válidos.');
    this.turnos[posicion] = turno;
    await this.guardar();
    eventBus.emit(EVENTOS_INTERNOS.actualizado, turno);
    return turno;
  }

  async eliminar(id: number): Promise<Turno | null> {
    const posicion = this.turnos.findIndex((turno) => turno.id === id);
    if (posicion === -1) return null;
    const [eliminado] = this.turnos.splice(posicion, 1);
    if (!eliminado) return null;
    await this.guardar();
    eventBus.emit(EVENTOS_INTERNOS.eliminado, eliminado);
    return eliminado;
  }

  private siguienteId(): number {
    return this.turnos.reduce((mayor, turno) => Math.max(mayor, turno.id), 0) + 1;
  }

  private async guardar(): Promise<void> {
    await writeFile(this.archivo, `${JSON.stringify(this.turnos, null, 2)}\n`, 'utf8');
  }
}

// Ejemplo equivalente usando callbacks. Se evita en la aplicación porque obliga a
// anidar la lógica dentro de la función de respuesta y dificulta el manejo centralizado de errores:
// readFileCallback('data/turnos.json', 'utf8', (error, contenido) => {
//   if (error) return console.error(error);
//   console.log(JSON.parse(contenido));
// });

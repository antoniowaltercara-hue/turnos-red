import type { Turno, TurnoCrudo } from '../models/turno.js';

function normalizarFecha(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim();
  const iso = limpio.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return limpio;

  const local = limpio.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!local) return null;
  return `${local[3]}-${local[2]}-${local[1]}`;
}

function normalizarHora(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim().replace('.', ':');
  const coincidencia = limpio.match(/^(\d{1,2}):(\d{2})$/);
  if (!coincidencia) return null;
  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) return null;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

function normalizarConfirmado(valor: unknown): boolean | null {
  if (typeof valor === 'boolean') return valor;
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim().toLowerCase();
  if (['si', 'sí', 'true', '1'].includes(limpio)) return true;
  if (['no', 'false', '0'].includes(limpio)) return false;
  return null;
}

export function normalizarTurno(crudo: TurnoCrudo): Turno | null {
  const id = Number(crudo.id);
  const paciente = typeof crudo.paciente === 'string' ? crudo.paciente.trim() : '';
  const documento = String(crudo.documento ?? '').trim();
  const especialidad =
    typeof crudo.especialidad === 'string' ? crudo.especialidad.trim().toUpperCase() : '';
  const fecha = normalizarFecha(crudo.fecha);
  const hora = normalizarHora(crudo.hora);
  const confirmado = normalizarConfirmado(crudo.confirmado);

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    paciente.length < 3 ||
    !/^\d{7,10}$/.test(documento) ||
    !especialidad ||
    !fecha ||
    !hora ||
    confirmado === null
  ) {
    return null;
  }

  const turno: Turno = { id, paciente, documento, especialidad, fecha, hora, confirmado };
  if (typeof crudo.observaciones === 'string' && crudo.observaciones.trim()) {
    turno.observaciones = crudo.observaciones.trim();
  }
  return turno;
}

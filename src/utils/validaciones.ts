import { ApiError } from '../errors/ApiError.js';
import type { EspecialidadEntrada } from '../models/especialidad.js';
import type { ProfesionalEntrada } from '../models/profesional.js';

function texto(valor: unknown, campo: string, minimo = 2): string {
  if (typeof valor !== 'string' || valor.trim().length < minimo) {
    throw new ApiError(400, 'Los datos enviados no son válidos.', [
      `El campo ${campo} debe tener al menos ${minimo} caracteres.`,
    ]);
  }
  return valor.trim();
}

export function idPositivo(valor: unknown, nombre = 'id'): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'El identificador no es válido.', [
      `${nombre} debe ser un número entero positivo.`,
    ]);
  }
  return id;
}

export function validarEspecialidad(entrada: EspecialidadEntrada) {
  return {
    nombre: texto(entrada.nombre, 'nombre', 3),
    descripcion: texto(entrada.descripcion, 'descripcion', 5),
  };
}

export function validarProfesional(entrada: ProfesionalEntrada) {
  const email = texto(entrada.email, 'email', 5).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Los datos enviados no son válidos.', [
      'El campo email debe tener un formato válido.',
    ]);
  }

  return {
    nombre: texto(entrada.nombre, 'nombre'),
    apellido: texto(entrada.apellido, 'apellido'),
    matricula: texto(entrada.matricula, 'matricula', 3).toUpperCase(),
    especialidadId: idPositivo(entrada.especialidadId, 'especialidadId'),
    email,
    telefono: texto(entrada.telefono, 'telefono', 6),
  };
}

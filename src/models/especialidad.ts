export interface Especialidad {
  especialidadId: number;
  nombre: string;
  descripcion: string;
  activa: boolean;
}

export interface EspecialidadEntrada {
  nombre?: unknown;
  descripcion?: unknown;
}

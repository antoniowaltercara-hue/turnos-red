export interface Profesional {
  medicoId: number;
  nombre: string;
  apellido: string;
  matricula: string;
  especialidadId: number;
  email: string;
  telefono: string;
  activo: boolean;
}

export interface ProfesionalEntrada {
  nombre?: unknown;
  apellido?: unknown;
  matricula?: unknown;
  especialidadId?: unknown;
  email?: unknown;
  telefono?: unknown;
}

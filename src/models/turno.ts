export interface TurnoCrudo {
  id?: unknown;
  paciente?: unknown;
  documento?: unknown;
  especialidad?: unknown;
  fecha?: unknown;
  hora?: unknown;
  confirmado?: unknown;
  observaciones?: unknown;
}

export interface Turno {
  id: number;
  paciente: string;
  documento: string;
  especialidad: string;
  fecha: string;
  hora: string;
  confirmado: boolean;
  observaciones?: string;
}

export type NuevoTurno = Omit<Turno, 'id'> & { id?: number };

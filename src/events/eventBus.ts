import { EventEmitter } from 'node:events';

export const eventBus = new EventEmitter();

export const EVENTOS_INTERNOS = {
  creado: 'turno:creado',
  actualizado: 'turno:actualizado',
  eliminado: 'turno:eliminado',
} as const;

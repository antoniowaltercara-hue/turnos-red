import { createServer, type Server as HttpServer } from 'node:http';
import { Server as SocketServer } from 'socket.io';
import { crearApp } from './app.js';
import { eventBus, EVENTOS_INTERNOS } from './events/eventBus.js';
import type { Turno } from './models/turno.js';
import type { TurnoService } from './services/turnoService.js';

export function crearServidor(service: TurnoService): { httpServer: HttpServer; io: SocketServer } {
  const httpServer = createServer(crearApp(service));
  const io = new SocketServer(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log(`Cliente Socket.IO conectado: ${socket.id}`);
  });

  eventBus.on(EVENTOS_INTERNOS.creado, (turno: Turno) => io.emit('turno:nuevo', turno));
  eventBus.on(EVENTOS_INTERNOS.actualizado, (turno: Turno) => io.emit('turno:actualizado', turno));
  eventBus.on(EVENTOS_INTERNOS.eliminado, (turno: Turno) => io.emit('turno:eliminado', turno));

  return { httpServer, io };
}

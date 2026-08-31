import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { io as conectarSocket } from 'socket.io-client';
import { crearServidor } from '../src/server.js';
import { TurnoService } from '../src/services/turnoService.js';

void test('los cinco endpoints y el evento en tiempo real funcionan', async () => {
  const carpeta = await mkdtemp(path.join(tmpdir(), 'turnos-red-'));
  const archivo = path.join(carpeta, 'turnos.json');
  await writeFile(
    archivo,
    JSON.stringify([
      {
        id: 1,
        paciente: 'Paciente Inicial',
        documento: '30111222',
        especialidad: 'CLÍNICA MÉDICA',
        fecha: '2026-08-20',
        hora: '09:00',
        confirmado: true,
      },
    ]),
  );

  const service = new TurnoService(archivo);
  await service.cargar();
  const { httpServer, io } = crearServidor(service);
  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  const direccion = httpServer.address();
  assert.ok(direccion && typeof direccion === 'object');
  const base = `http://127.0.0.1:${direccion.port}`;

  const socket = conectarSocket(base, { transports: ['websocket'] });
  await new Promise<void>((resolve) => socket.on('connect', () => resolve()));
  const eventoNuevo = new Promise<{ id: number }>((resolve) => socket.once('turno:nuevo', resolve));

  const listado = await fetch(`${base}/turnos`);
  assert.equal(listado.status, 200);
  const detalle = await fetch(`${base}/turnos/1`);
  assert.equal(detalle.status, 200);

  const nuevo = {
    paciente: 'Nuevo Paciente',
    documento: '32123456',
    especialidad: 'Pediatría',
    fecha: '21/08/2026',
    hora: '10.30',
    confirmado: 'si',
  };
  const creado = await fetch(`${base}/turnos`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(nuevo),
  });
  assert.equal(creado.status, 201);
  const creadoJson = (await creado.json()) as { id: number };
  assert.equal((await eventoNuevo).id, creadoJson.id);

  const actualizado = await fetch(`${base}/turnos/${creadoJson.id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...nuevo, paciente: 'Paciente Actualizado' }),
  });
  assert.equal(actualizado.status, 200);

  const eliminado = await fetch(`${base}/turnos/${creadoJson.id}`, { method: 'DELETE' });
  assert.equal(eliminado.status, 200);
  const persistido = JSON.parse(await readFile(archivo, 'utf8')) as unknown[];
  assert.equal(persistido.length, 1);

  socket.close();
  await io.close();
});

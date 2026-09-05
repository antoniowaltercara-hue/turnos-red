import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { crearServidor } from '../src/server.js';
import { EspecialidadService } from '../src/services/especialidadService.js';
import { ProfesionalService } from '../src/services/profesionalService.js';
import { TurnoService } from '../src/services/turnoService.js';

void test('los endpoints de especialidades y profesionales responden correctamente', async () => {
  const carpeta = await mkdtemp(path.join(tmpdir(), 'turnos-red-api2-'));
  const turnosArchivo = path.join(carpeta, 'turnos.json');
  const especialidadesArchivo = path.join(carpeta, 'especialidades.json');
  const profesionalesArchivo = path.join(carpeta, 'profesionales.json');
  await Promise.all([
    writeFile(turnosArchivo, '[]'),
    writeFile(
      especialidadesArchivo,
      JSON.stringify([
        {
          especialidadId: 1,
          nombre: 'Clínica médica',
          descripcion: 'Atención general',
          activa: true,
        },
      ]),
    ),
    writeFile(
      profesionalesArchivo,
      JSON.stringify([
        {
          medicoId: 1,
          nombre: 'Laura',
          apellido: 'Gómez',
          matricula: 'MN-12540',
          especialidadId: 1,
          email: 'laura@turnosred.com',
          telefono: '3515550101',
          activo: true,
        },
      ]),
    ),
  ]);

  const turnos = new TurnoService(turnosArchivo);
  const especialidades = new EspecialidadService(especialidadesArchivo);
  const profesionales = new ProfesionalService(profesionalesArchivo, especialidades);
  await Promise.all([turnos.cargar(), especialidades.cargar(), profesionales.cargar()]);
  const { httpServer, io } = crearServidor(turnos, especialidades, profesionales);
  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  const direccion = httpServer.address();
  assert.ok(direccion && typeof direccion === 'object');
  const base = `http://127.0.0.1:${direccion.port}`;
  const json = { 'content-type': 'application/json' };

  assert.equal((await fetch(`${base}/especialidades`)).status, 200);
  assert.equal((await fetch(`${base}/especialidades/1`)).status, 200);
  assert.equal((await fetch(`${base}/especialidades/999`)).status, 404);
  assert.equal((await fetch(`${base}/especialidades/no-es-id`)).status, 400);

  const altaEspecialidad = await fetch(`${base}/especialidades`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ nombre: 'Cardiología', descripcion: 'Atención del corazón' }),
  });
  assert.equal(altaEspecialidad.status, 201);
  const especialidadNueva = (await altaEspecialidad.json()) as {
    datos: { especialidadId: number };
  };

  const especialidadInvalida = await fetch(`${base}/especialidades`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ nombre: '', descripcion: '' }),
  });
  assert.equal(especialidadInvalida.status, 400);

  assert.equal((await fetch(`${base}/profesionales`)).status, 200);
  assert.equal((await fetch(`${base}/profesionales/1`)).status, 200);
  assert.equal((await fetch(`${base}/profesionales/999`)).status, 404);

  const profesionalBase = {
    nombre: 'Ana',
    apellido: 'López',
    matricula: 'MP-20260',
    especialidadId: especialidadNueva.datos.especialidadId,
    email: 'ana.lopez@turnosred.com',
    telefono: '3515550199',
  };
  const altaProfesional = await fetch(`${base}/profesionales`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify(profesionalBase),
  });
  assert.equal(altaProfesional.status, 201);
  const profesionalNuevo = (await altaProfesional.json()) as { datos: { medicoId: number } };

  const especialidadInexistente = await fetch(`${base}/profesionales`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ ...profesionalBase, matricula: 'MP-20261', especialidadId: 999 }),
  });
  assert.equal(especialidadInexistente.status, 404);

  const actualizado = await fetch(`${base}/profesionales/${profesionalNuevo.datos.medicoId}`, {
    method: 'PUT',
    headers: json,
    body: JSON.stringify({ ...profesionalBase, nombre: 'Ana María' }),
  });
  assert.equal(actualizado.status, 200);

  const bajaProfesional = await fetch(`${base}/profesionales/${profesionalNuevo.datos.medicoId}`, {
    method: 'DELETE',
  });
  assert.equal(bajaProfesional.status, 200);
  const bajaProfesionalJson = (await bajaProfesional.json()) as { datos: { activo: boolean } };
  assert.equal(bajaProfesionalJson.datos.activo, false);

  const bajaEspecialidad = await fetch(
    `${base}/especialidades/${especialidadNueva.datos.especialidadId}`,
    { method: 'DELETE' },
  );
  assert.equal(bajaEspecialidad.status, 200);
  const bajaEspecialidadJson = (await bajaEspecialidad.json()) as { datos: { activa: boolean } };
  assert.equal(bajaEspecialidadJson.datos.activa, false);

  const rutaInexistente = await fetch(`${base}/ruta-que-no-existe`);
  assert.equal(rutaInexistente.status, 404);

  await io.close();
});

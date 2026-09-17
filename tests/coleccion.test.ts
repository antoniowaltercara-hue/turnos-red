import assert from 'node:assert/strict';
import { mkdtemp, copyFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { crearServidor } from '../src/server.js';
import { EspecialidadService } from '../src/services/especialidadService.js';
import { ProfesionalService } from '../src/services/profesionalService.js';
import { TurnoService } from '../src/services/turnoService.js';

void test('regresión HTTP de las 20 peticiones de la colección API3', async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'turnos-api3-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const name of ['turnos', 'especialidades', 'profesionales']) {
    await copyFile(`src/data/${name}.json`, path.join(dir, `${name}.json`));
  }
  const turnos = new TurnoService(path.join(dir, 'turnos.json'));
  const esp = new EspecialidadService(path.join(dir, 'especialidades.json'));
  const pro = new ProfesionalService(path.join(dir, 'profesionales.json'), esp);
  await Promise.all([turnos.cargar(), esp.cargar(), pro.cargar()]);
  const { httpServer, io } = crearServidor(turnos, esp, pro);
  t.after(() => io.close());
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === 'object');
  const variables: Record<string, string> = { baseUrl: `http://127.0.0.1:${address.port}` };
  const collection = JSON.parse(
    await readFile('postman/TurnosRed API3.postman_collection.json', 'utf8'),
  ) as {
    item: {
      name: string;
      request: { method: string; url: string; body?: { raw: string } };
      event: { script: { exec: string[] } }[];
    }[];
  };
  const replace = (value: string) =>
    value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      assert.ok(variables[key] !== undefined, `Variable sin definir: ${key}`);
      return variables[key];
    });
  for (const item of collection.item) {
    await t.test(item.name, async () => {
      const expected = Number(item.event[0]?.script.exec[0]?.match(/status\((\d+)\)/)?.[1]);
      const response = await fetch(replace(item.request.url), {
        method: item.request.method,
        ...(item.request.body
          ? {
              headers: { 'content-type': 'application/json' },
              body: replace(item.request.body.raw),
            }
          : {}),
      });
      const json = (await response.json()) as {
        exito: boolean;
        datos?: { especialidadId?: number; medicoId?: number; activa?: boolean; activo?: boolean };
      };
      assert.equal(response.status, expected);
      assert.equal(json.exito, expected < 400);
      if (item.name.startsWith('04'))
        variables.especialidadNueva = String(json.datos?.especialidadId);
      if (item.name.startsWith('08')) variables.profesionalNuevo = String(json.datos?.medicoId);
      if (item.name.startsWith('05')) assert.equal(json.datos?.activa, false);
      if (item.name.startsWith('10')) assert.equal(json.datos?.activo, false);
    });
  }
  await t.test('JSON mal formado devuelve 400 y el servidor sigue operativo', async () => {
    const res = await fetch(`${variables.baseUrl}/especialidades`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{mal',
    });
    assert.equal(res.status, 400);
    assert.equal((await fetch(`${variables.baseUrl}/`)).status, 200);
  });
});

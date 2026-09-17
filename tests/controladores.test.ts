import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response } from 'express';
import { EspecialidadController } from '../src/controllers/especialidadController.js';
import { ProfesionalController } from '../src/controllers/profesionalController.js';
import { GeneralController } from '../src/controllers/generalController.js';
import { EspecialidadService } from '../src/services/especialidadService.js';
import { ProfesionalService } from '../src/services/profesionalService.js';

function respuesta() {
  let status = 0;
  let calls = 0;
  let body: Record<string, unknown> = {};
  const res = {
    status(value: number) {
      status = value;
      return this;
    },
    json(value: Record<string, unknown>) {
      calls++;
      body = value;
      return this;
    },
  } as Response;
  return { res, read: () => ({ status, calls, body }) };
}

for (const entidad of ['especialidades', 'profesionales']) {
  for (const body of [undefined, null, [], 'texto', 123, {}, { nombre: 2 }]) {
    void test(`${entidad}: rechaza cuerpo ${JSON.stringify(body)} sin mutar`, async () => {
      const esp = new EspecialidadService('sin-archivo');
      const pro = new ProfesionalService('sin-archivo', esp);
      const controller =
        entidad === 'especialidades'
          ? new EspecialidadController(esp)
          : new ProfesionalController(pro);
      const capture = respuesta();
      const returned = await controller.crear({ body, params: {} } as Request, capture.res);
      assert.equal(returned, capture.res);
      assert.equal(capture.read().status, 400);
      assert.equal(capture.read().calls, 1);
      assert.equal(capture.read().body.exito, false);
      assert.equal(esp.obtenerTodas().length, 0);
      assert.equal(pro.obtenerTodos().length, 0);
    });
  }
  for (const id of ['abc', '0', '-1', '1.5', '9007199254740992']) {
    void test(`${entidad}: identificador ${id} devuelve 400`, async () => {
      const esp = new EspecialidadService('sin-archivo');
      const pro = new ProfesionalService('sin-archivo', esp);
      const controller =
        entidad === 'especialidades'
          ? new EspecialidadController(esp)
          : new ProfesionalController(pro);
      const capture = respuesta();
      await controller.obtener({ params: { id } } as unknown as Request, capture.res);
      assert.equal(capture.read().status, 400);
      assert.equal(capture.read().calls, 1);
    });
  }
}

void test('error inesperado y peticiones simultáneas no comparten status ni filtran detalles', async () => {
  const service = new EspecialidadService('sin-archivo');
  service.obtenerTodas = () => {
    throw new Error('clave-interna-privada');
  };
  const c = new EspecialidadController(service);
  const a = respuesta();
  const b = respuesta();
  await Promise.all([
    c.listar({} as Request, a.res),
    c.obtener({ params: { id: '999' } } as unknown as Request, b.res),
  ]);
  assert.equal(a.read().status, 500);
  assert.equal(b.read().status, 404);
  assert.equal(a.read().calls, 1);
  assert.equal(b.read().calls, 1);
  assert.ok(!JSON.stringify(a.read().body).includes('clave-interna'));
});

void test('controlador general: bienvenida y ruta desconocida', async () => {
  const c = new GeneralController();
  const a = respuesta();
  const b = respuesta();
  await c.bienvenida({} as Request, a.res);
  await c.rutaNoEncontrada({ method: 'GET', originalUrl: '/no-existe' } as Request, b.res);
  assert.equal(a.read().status, 200);
  assert.equal(b.read().status, 404);
  assert.equal(b.read().body.exito, false);
});

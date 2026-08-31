import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizarTurno } from '../src/utils/normalizarTurno.js';

void test('normaliza un turno heterogéneo', () => {
  const resultado = normalizarTurno({
    id: '102',
    paciente: '  Carlos Ruiz ',
    documento: 31654210,
    especialidad: 'pediatría',
    fecha: '14/08/2026',
    hora: '10.00',
    confirmado: 'si',
  });
  assert.deepEqual(resultado, {
    id: 102,
    paciente: 'Carlos Ruiz',
    documento: '31654210',
    especialidad: 'PEDIATRÍA',
    fecha: '2026-08-14',
    hora: '10:00',
    confirmado: true,
  });
});

void test('descarta un ID inválido', () => {
  assert.equal(
    normalizarTurno({
      id: 'x',
      paciente: 'Paciente válido',
      documento: '30111222',
      especialidad: 'clínica médica',
      fecha: '2026-08-14',
      hora: '10:00',
      confirmado: true,
    }),
    null,
  );
});

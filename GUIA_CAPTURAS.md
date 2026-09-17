# Guía de capturas - Actividad 3

Abrir codigo-fuente en VS Code. Terminal > Nueva terminal: npm.cmd ci y npm.cmd run dev. Dejar abierto. Usar datos de prueba.

Ejecutar en orden, sin reiniciar entre capturas. En modo manual, anotar el ID creado en capturas 4 y 8 y reemplazar las variables de sus bajas/actualización. En la colección, los scripts lo guardan automáticamente.

## Captura 1: Bienvenida
GET http://localhost:3000/
Estado esperado: 200.

Body > none.

## Captura 2: Listar especialidades
GET http://localhost:3000/especialidades
Estado esperado: 200.

Body > none.

## Captura 3: Buscar especialidad
GET http://localhost:3000/especialidades/1
Estado esperado: 200.

Body > none.

## Captura 4: Crear especialidad
POST http://localhost:3000/especialidades
Estado esperado: 201.

Body > raw > JSON:
```json
{
  "nombre": "Cardiología API3",
  "descripcion": "Atención y control del corazón"
}
```

## Captura 5: Baja lógica de especialidad
DELETE http://localhost:3000/especialidades/{{especialidadNueva}}
Estado esperado: 200.

Body > none.

Reemplazar {{especialidadNueva}} o {{profesionalNuevo}} por el ID real si se trabaja manualmente. No escribir las llaves con un ID inventado.

## Captura 6: Listar profesionales
GET http://localhost:3000/profesionales
Estado esperado: 200.

Body > none.

## Captura 7: Buscar profesional
GET http://localhost:3000/profesionales/1
Estado esperado: 200.

Body > none.

## Captura 8: Crear profesional
POST http://localhost:3000/profesionales
Estado esperado: 201.

Body > raw > JSON:
```json
{
  "nombre": "Ana",
  "apellido": "López",
  "matricula": "MP-API3-001",
  "especialidadId": 1,
  "email": "ana@example.com",
  "telefono": "3515550199"
}
```

## Captura 9: Actualizar profesional
PUT http://localhost:3000/profesionales/{{profesionalNuevo}}
Estado esperado: 200.

Body > raw > JSON:
```json
{
  "nombre": "Ana María",
  "apellido": "López",
  "matricula": "MP-API3-001",
  "especialidadId": 1,
  "email": "ana@example.com",
  "telefono": "3515550199"
}
```

Reemplazar {{especialidadNueva}} o {{profesionalNuevo}} por el ID real si se trabaja manualmente. No escribir las llaves con un ID inventado.

## Captura 10: Baja lógica de profesional
DELETE http://localhost:3000/profesionales/{{profesionalNuevo}}
Estado esperado: 200.

Body > none.

Reemplazar {{especialidadNueva}} o {{profesionalNuevo}} por el ID real si se trabaja manualmente. No escribir las llaves con un ID inventado.

## Captura 11: Ruta inexistente
GET http://localhost:3000/ruta-inexistente
Estado esperado: 404.

Body > none.

## Captura 12: Cuerpo ausente
POST http://localhost:3000/especialidades
Estado esperado: 400.

Body > none.

## Captura 13: ID con tipo incorrecto
GET http://localhost:3000/especialidades/abc
Estado esperado: 400.

Body > none.

## Captura 14: Recurso inexistente
GET http://localhost:3000/profesionales/999999
Estado esperado: 404.

Body > none.

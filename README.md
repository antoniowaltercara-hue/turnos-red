# TurnosRed - Actividades 1 y 2

Este proyecto es una API hecha con Node.js, Express y TypeScript para administrar turnos, especialidades y profesionales de salud. En la Actividad 2 agregué los recursos de especialidades y profesionales sobre el trabajo anterior.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

El servidor queda disponible en `http://localhost:3000`. Para compilar y probar todo usé:

```bash
npm run build
npm test
```

## Endpoints de la Actividad 2

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/especialidades` | Lista todas las especialidades |
| GET | `/especialidades/:id` | Busca por `especialidadId` |
| POST | `/especialidades` | Crea una especialidad |
| DELETE | `/especialidades/:id` | Hace una baja lógica (`activa: false`) |
| GET | `/profesionales` | Lista todos los profesionales |
| GET | `/profesionales/:id` | Busca por `medicoId` |
| POST | `/profesionales` | Crea un profesional y controla su especialidad |
| PUT | `/profesionales/:id` | Actualiza todos sus datos |
| DELETE | `/profesionales/:id` | Hace una baja lógica (`activo: false`) |

Los códigos utilizados son `200` para consultas y cambios correctos, `201` para altas, `400` para datos inválidos, `404` cuando no existe el recurso o la ruta y `500` para un error interno inesperado.

## Ejemplos de cuerpos JSON

Alta de especialidad:

```json
{
  "nombre": "Cardiología",
  "descripcion": "Atención y control del corazón"
}
```

Alta o actualización de profesional:

```json
{
  "nombre": "Ana",
  "apellido": "López",
  "matricula": "MP-20260",
  "especialidadId": 3,
  "email": "ana.lopez@turnosred.com",
  "telefono": "3515550199"
}
```

Antes de crear o modificar un profesional, la API verifica que la especialidad exista y esté activa. También controla los campos obligatorios, el correo, el identificador y que la matrícula no esté repetida.

## Datos y funcionamiento

Los datos iniciales están en `src/data`. Al iniciar el servidor se cargan en arreglos de memoria. Los cambios de especialidades y profesionales son de prueba y duran hasta reiniciar el proyecto, tal como pide la consigna. Las bajas no borran el registro: solamente cambian `activa` o `activo` a `false`.

Después de cada POST, PUT o DELETE se ejecutan `console.clear()` y `console.table()` para mostrar en la terminal el estado actualizado del recurso.

## Pruebas en Postman

En la carpeta `postman` dejé la colección **TurnosMed API** y el ambiente **TurnosMed Local**. La colección está separada en las carpetas **Especialidades**, **Profesionales** y **Errores controlados**. Incluye casos correctos y casos con datos o identificadores incorrectos.

Para usarla:

1. Ejecutar `npm run dev`.
2. Abrir Postman y seleccionar **Import**.
3. Importar los dos archivos de la carpeta `postman`.
4. Elegir el ambiente **TurnosMed Local**.
5. Ejecutar primero las altas y después las actualizaciones o bajas.

## Organización principal

- `src/controllers`: recibe las peticiones y usa `try/catch`.
- `src/routes`: define las rutas de cada recurso.
- `src/services`: contiene la lógica y los arreglos en memoria.
- `src/models`: define los tipos de TypeScript.
- `src/middleware`: maneja errores y rutas no encontradas.
- `src/data`: guarda los datos iniciales en JSON.
- `tests`: contiene las pruebas automáticas.
- `postman`: contiene la colección lista para importar.

La funcionalidad de turnos y Socket.IO de la Actividad 1 se mantiene sin cambios importantes.

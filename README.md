# TurnosRed - Actividades 1, 2 y 3

Continuación de las actividades 1 y 2 de Integraciones Web. Controladores async, validaciones, try/catch y respuestas HTTP explícitas.

## Ejecutar en Windows

Instalar Node.js 24 o superior. Extraer el ZIP, abrir codigo-fuente en Visual Studio Code y abrir Terminal > Nueva terminal. Ejecutar:

```powershell
npm.cmd ci
npm.cmd run dev
```

Dejar la terminal abierta. Dirección: http://localhost:3000. Ctrl+C detiene el servidor.
Para compilar y ejecutar sin modo desarrollo:

```powershell
npm.cmd run build
npm.cmd start
```

No ejecutar ambas modalidades al mismo tiempo. No se necesitan claves ni base de datos.

## Endpoints

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | / | 200, Hello World |
| GET | /especialidades | 200, listado |
| GET | /especialidades/:id | 200, detalle |
| POST | /especialidades | 201, alta |
| DELETE | /especialidades/:id | 200, baja lógica |
| GET | /profesionales | 200, listado |
| GET | /profesionales/:id | 200, detalle |
| POST | /profesionales | 201, alta |
| PUT | /profesionales/:id | 200, modificación |
| DELETE | /profesionales/:id | 200, baja lógica |
| Cualquiera | Ruta no registrada | 404, controlador general |

Se conservan GET/POST /turnos, GET/PUT/DELETE /turnos/:id y GET /salud.
La pantalla Socket.IO ahora está en http://localhost:3000/tiempo-real/; la raíz queda para Hello World.

## Organización y decisiones

- src/controllers: controladores general, especialidades, profesionales y turnos.
- src/routes: asignación de rutas.
- src/services: lógica de negocio y acceso a datos.
- src/utils: validaciones y respuestas de error.
- src/middleware: errores generales, incluido JSON mal formado.
- src/models y src/data: tipos y datos iniciales.
- tests y postman: pruebas automáticas y colección.

Todos los métodos de controladores son async, tienen try/catch y retornan res.status(status).json(...).
status es local para que las peticiones simultáneas no compartan su valor.
Los cuerpos ausentes o incorrectos y los IDs mal formados generan 400; un recurso inexistente, 404; un error inesperado, 500.
Las validaciones usan Error o ApiError, que hereda de Error. Se comprueban campos, correo, matrícula única y especialidad existente y activa antes de guardar.

Las bajas mantienen activa/activo=false y devuelven 200 con JSON. No se usa 204 porque no admite cuerpo de respuesta. Los listados conservan registros inactivos, como en la actividad anterior.
Especialidades y profesionales funcionan en memoria: reiniciar restaura los JSON iniciales. Los turnos conservan la persistencia local anterior.
Es un proyecto educativo local, sin autenticación. Usar solamente datos de prueba.

## Postman y capturas

Importar postman/TurnosRed API3.postman_collection.json. Los archivos TurnosMed son de la actividad anterior.
La colección nueva contiene 20 peticiones en orden. baseUrl vale http://localhost:3000 y los IDs de las altas se guardan en variables.
No seleccionar un ambiente anterior que sobrescriba las variables. Ejecutar del 01 al 20 sin reiniciar entre pasos.
Reiniciar antes de repetir toda la secuencia: la baja lógica no libera la matrícula.
Si la aplicación solicita una cuenta para importar, se pueden ingresar las peticiones manualmente siguiendo GUIA_CAPTURAS.md.

## Verificación

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd test
```

La versión se verificó con TypeScript, ESLint y 52 pruebas aprobadas.
Incluye regresión de turnos y Socket.IO, controles de datos y ejecución HTTP de las 20 peticiones de la colección.
La ejecución HTTP usa fetch: no ejecuta los scripts dentro del motor de Postman y no sustituye sus capturas.

## Entrega y apoyo

Este repositorio reúne las actividades 1, 2 y 3. También se preparó un ZIP como alternativa de entrega de la Actividad 3.
El informe tiene espacios señalados para incorporar capturas reales antes de la entrega definitiva.
Se utilizó ChatGPT como apoyo para refactorizar el código, revisar validaciones, preparar pruebas y documentación.

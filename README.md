# TurnosRed

TurnosRed es un backend realizado con Node.js, TypeScript, Express y Socket.IO. Lee turnos desde un archivo JSON, normaliza los datos y ofrece una API REST para consultar, crear, actualizar y eliminar turnos médicos.

## Requisitos previos

- Node.js 24 LTS.
- NVM para seleccionar la versión indicada en `.nvmrc`.
- npm.
- Postman o un cliente HTTP equivalente.

## Instalación

```bash
nvm use
npm install
copy .env.example .env
npm run dev
```

El servidor queda disponible en `http://localhost:3000`. La pantalla de eventos en tiempo real se abre en esa misma dirección.

## Variables de entorno

| Variable    | Ejemplo              | Uso                                       |
| ----------- | -------------------- | ----------------------------------------- |
| `PORT`      | `3000`               | Puerto HTTP del servidor.                 |
| `DATA_FILE` | `./data/turnos.json` | Ruta del archivo que contiene los turnos. |

## Scripts npm

| Script                 | Descripción                                        |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Inicia el servidor y reinicia al detectar cambios. |
| `npm run debug`        | Inicia Node con el inspector para depurar.         |
| `npm run build`        | Compila TypeScript dentro de `dist/`.              |
| `npm start`            | Ejecuta la versión compilada.                      |
| `npm run lint`         | Revisa el código con ESLint.                       |
| `npm run format`       | Aplica el formato de Prettier.                     |
| `npm run format:check` | Comprueba el formato sin modificar archivos.       |
| `npm test`             | Ejecuta las pruebas automáticas.                   |

## Endpoints

| Método | Ruta          | Resultado correcto                                         |
| ------ | ------------- | ---------------------------------------------------------- |
| GET    | `/turnos`     | `200` y lista de turnos.                                   |
| GET    | `/turnos/:id` | `200` y un turno; `404` si no existe.                      |
| POST   | `/turnos`     | `201` y el turno creado; `400` si los datos son inválidos. |
| PUT    | `/turnos/:id` | `200` y el turno actualizado.                              |
| DELETE | `/turnos/:id` | `200` y confirmación de eliminación.                       |

Ejemplo para POST y PUT:

```json
{
  "paciente": "Lucía Fernández",
  "documento": "35123456",
  "especialidad": "Clínica médica",
  "fecha": "22/08/2026",
  "hora": "14.30",
  "confirmado": "si",
  "observaciones": "Primera consulta"
}
```

## Eventos

El servicio emite internamente `turno:creado`, `turno:actualizado` y `turno:eliminado`. El servidor Socket.IO los retransmite como `turno:nuevo`, `turno:actualizado` y `turno:eliminado`.

Para comprobarlo, se deja abierta `http://localhost:3000` y se ejecuta un POST, PUT o DELETE desde Postman. El cambio aparece sin recargar la página.

## Estructura

```text
turnos-red/
├── data/                  Archivo JSON de entrada
├── public/                Cliente simple para ver eventos Socket.IO
├── src/
│   ├── config/            Variables de entorno
│   ├── controllers/       Entrada y salida HTTP
│   ├── events/            EventEmitter interno
│   ├── middleware/        Manejo de errores
│   ├── models/            Interfaces TurnoCrudo y Turno
│   ├── routes/            Rutas de Express
│   ├── services/          Lectura, normalización y persistencia
│   └── utils/             Función de normalización
├── tests/                 Pruebas de normalización, API y Socket.IO
├── .env.example
├── .nvmrc
├── eslint.config.js
├── package.json
└── tsconfig.json
```

## Códigos de estado usados

- `200`: consulta, actualización o eliminación correcta.
- `201`: turno creado.
- `400`: ID o cuerpo de la solicitud inválido.
- `404`: turno o ruta no encontrada.
- `500`: error interno no esperado.

## Comprobaciones antes de entregar

```bash
npm run format
npm run lint
npm run build
npm test
```

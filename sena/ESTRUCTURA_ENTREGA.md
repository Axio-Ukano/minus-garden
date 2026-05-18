# Estructura de Entrega — SENA GA7 (Minus Garden)

> Documento guía para el instructor. Detalla qué carpetas y archivos respaldan
> cada evidencia, cómo levantar el sistema localmente y cómo preparar el ZIP
> de entrega.

## 1. Mapeo evidencia ↔ archivo

| Evidencia                       | Ruta principal                                 | Cobertura                                                         |
| ------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| AA1-EV05 (versionamiento)       | `sena/SENA_VERSIONING.md`                      | Comandos Git, flujo y convención de commits                       |
| AA2-EV01 (JDBC / CRUD)          | `sena-backend/src/database/connection.js`      | Conexión SQLite (driver `node:sqlite`, equivalente a JDBC)        |
|                                 | `sena-backend/src/routes/plants.js`            | CRUD completo: INSERT, SELECT, UPDATE, DELETE                     |
| AA2-EV02 (Servlets / web)       | `sena-backend/src/server.js`                   | Express + página HTML de bienvenida (≈ JSP)                       |
|                                 | `sena-backend/src/routes/*`                    | Endpoints `GET`/`POST` ≈ `doGet`/`doPost`                         |
| AA3-EV01 (framework web)        | `src/features/sena/`                           | Demostración con React + Vite (framework web)                     |
|                                 | `docs/architecture.md`                         | Documenta el framework existente                                  |
| AA3-EV02 (pruebas y validación) | `sena-backend/docs/VALIDATION_TESTS.md`        | 14 pruebas de validación negativas + 7 reglas en cliente          |
| AA4-EV03 (frontend React)       | `src/features/sena/components/*`               | Componentes React funcionales con estado, eventos y ciclo de vida |
|                                 | proyecto completo `src/`                       | Aplicación Minus Garden ya implementada en React 19               |
| AA5-EV01 (API auth caso)        | `sena-backend/src/routes/auth.js`              | `register`, `login`, `status` con respuestas claras               |
| AA5-EV02 (testing API caso)     | `sena-backend/tests/api.test.js`               | 10 tests automatizados                                            |
|                                 | `sena-backend/tests/endpoints-collection.json` | Colección Postman v2.1                                            |
| AA5-EV03 (API proyecto)         | `sena-backend/src/routes/plants.js`            | API del dominio (plantas) del proyecto                            |
| AA5-EV04 (testing API proyecto) | `sena-backend/tests/api.test.js`               | Mismos tests cubren el dominio                                    |

## 2. Cómo levantar el sistema

### 2.1 Pre-requisitos

| Herramienta | Versión mínima                                 |
| ----------- | ---------------------------------------------- |
| Node.js     | 22.5 o superior (necesario para `node:sqlite`) |
| pnpm        | 8 o superior (sólo frontend)                   |
| npm         | 10 o superior (sólo backend)                   |

### 2.2 Backend (puerto 3001)

```bash
cd sena-backend
npm install
npm start
```

El servidor expone:

- `http://localhost:3001/` — bienvenida HTML
- `http://localhost:3001/api/plants` — CRUD de plantas
- `http://localhost:3001/api/auth/*` — registro / login / status

Para correr el test suite contra el backend:

```bash
npm test       # ejecuta tests/api.test.js — 10/10 esperados
```

### 2.3 Frontend (Vite dev server)

```bash
pnpm install
pnpm dev
```

La aplicación se sirve en `http://localhost:1420` (puerto Tauri).
La pestaña **"SENA"** del nav inferior abre el módulo `src/features/sena`,
que consume el backend en `http://localhost:3001`.

### 2.4 Aplicación desktop completa (opcional)

```bash
pnpm tauri dev
```

Levanta la app empaquetada en Tauri. No es requerido para las evidencias.

## 3. URL y rama

- Repositorio remoto: <https://github.com/Axio-Ukano/minus-garden>
- Rama de evidencias: `sena/evidencias`
- Rama principal: `main` (no modificada por esta entrega)

## 4. Preparación del ZIP de entrega

El ZIP debe **excluir** los siguientes directorios para mantener un tamaño razonable:

```
node_modules/             # dependencias regenerables con `npm install` / `pnpm install`
dist/                     # build de Vite
src-tauri/target/         # artefactos de compilación Rust
.git/                     # historial Git (opcional incluirlo según preferencia del instructor)
sena-backend/node_modules/
sena-backend/minus_garden.db   # base de datos local generada en runtime
sena-backend/*.db*
```

Comando sugerido (PowerShell):

```powershell
# Desde la raíz del repo, con la rama sena/evidencias activa:
$exclude = @(
  "node_modules", "dist", ".git",
  "src-tauri/target", "sena-backend/node_modules",
  "*.db", "*.db-shm", "*.db-wal"
)
Compress-Archive -Path . -DestinationPath ../minus-garden-sena-ga7.zip -Force -Exclude $exclude
```

> Para resultados deterministas se recomienda revisar el ZIP final y eliminar
> manualmente cualquier carpeta `node_modules` residual antes de entregar.

## 5. Comprobación rápida pre-entrega

| Item                                         | Comando                                   |
| -------------------------------------------- | ----------------------------------------- |
| El frontend tipa-checea y lintea             | `pnpm typecheck && pnpm lint`             |
| El backend pasa los 10 tests                 | `cd sena-backend && npm test`             |
| Existe la rama y los commits de evidencia    | `git log --oneline sena/evidencias ^main` |
| La documentación de evidencias está completa | revisar `sena-backend/docs/` y `sena/`    |

# Evidencia GA8-220501096-AA1-EV01

## Desarrollar software a partir de la integración de sus módulos componentes

- **Aprendiz:** Carlos F. Pico
- **Programa:** Análisis y desarrollo de software
- **Código del programa de formación:** 228118
- **Programa SENA (regional):** 3070224 - Análisis y Desarrollo de Software
- **Instructor:** Edduar Yakseir Perez Perez
- **Fecha:** 18 - 05 - 2026
- **Repositorio:** ver `REPO.txt`
- **Rama de trabajo:** `sena/evidencias`

## 1. Contenido de esta entrega

Esta evidencia entrega los productos solicitados por la guía 8 — sección
3.1.1, Actividad GA8-220501096-AA1 (Integrar módulos), Evidencia EV01:
**código fuente, archivos compilados, documentos y URL** del proyecto
formativo **Minu's Garden**.

| Producto                                  | Archivo / Ruta dentro del ZIP                    |
| ----------------------------------------- | ------------------------------------------------ |
| Código fuente completo                    | (todo este ZIP, generado vía `git archive HEAD`) |
| Documento técnico de integración (PDF/MD) | **`DESARROLLO.md`** (incluido)                   |
| Justificación de la evidencia             | **`JUSTIFICACION.md`** (este archivo)            |
| Enlace al repositorio (URL)               | **`REPO.txt`**                                   |
| Capturas de pantalla                      | `capturas/` (adjuntar por el aprendiz)           |

> El documento `DESARROLLO.md` corresponde al informe técnico solicitado por
> el SENA, listo para exportar a PDF. Los marcadores
> `[INSERTAR CAPTURA DE PANTALLA N]` señalan los 6 lugares donde el aprendiz
> debe pegar las capturas requeridas antes de imprimir / exportar a PDF.

## 2. Mapeo evidencia ↔ checklist de la guía

La guía 8 enumera los elementos que debe cubrir esta evidencia (sección
"Elementos a tener en cuenta" de la actividad GA8-220501096-AA1-EV01).
Cada uno está respaldado por uno o más artefactos del repositorio:

| Elemento exigido por la guía                       | Dónde se evidencia                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| Requerimientos del sistema                         | `DESARROLLO.md` §"Historias de Usuario" (HU-01 → HU-04)             |
| Historias de usuario / casos de uso                | `DESARROLLO.md` §"Historias de Usuario"                             |
| IDE de desarrollo                                  | `DESARROLLO.md` §"Matriz de Versiones" + `.vscode/`                 |
| Diagrama de clases / paquetes / componentes        | `docs/architecture.md` + `DESARROLLO.md` §"Arquitectura"            |
| Mecanismos de seguridad                            | `sena-backend/src/routes/auth.js` (SHA-256 + validación)            |
| Identificar capas y componentes                    | `DESARROLLO.md` §"Arquitectura del Software y Flujo en Capas"       |
| Metodología de desarrollo de software              | `docs/playbook.md` + Conventional Commits                           |
| Mapa de navegación                                 | `src/App.tsx` (router/tabs) + `docs/architecture.md`                |
| Codificación de cada módulo                        | `src/modules/{timer,plants,history,subjects,audio,music,settings}/` |
| Repositorio de control de versiones (Git)          | URL en `REPO.txt` + historial de commits                            |
| Librerías por capa                                 | `package.json` + `DESARROLLO.md` §"Matriz de Versiones"             |
| Frameworks por capa                                | React 19, Zustand 5, Vite 7, Tauri 2, Vitest 4                      |
| División en componentes reutilizables              | `src/components/` + hook `usePlantGrowth`                           |
| Buenas prácticas de escritura de código            | ESLint + Prettier + `eslint.config.js`                              |
| División del código en paquetes con nombres claros | `src/modules/` (1 carpeta = 1 responsabilidad)                      |
| Patrones de diseño                                 | Store (Zustand), Service Layer, IPC Bridge — §Arquitectura          |
| Pruebas unitarias de cada módulo                   | `src/modules/timer/timerStore.test.ts` + `pnpm test`                |
| Configuraciones de servidores y BD                 | `src-tauri/tauri.conf.json` + `sena-backend/src/server.js`          |
| Documentar ambientes de desarrollo y pruebas       | `docs/playbook.md` + `sena/ESTRUCTURA_ENTREGA.md`                   |

## 3. Módulos integrados del sistema

Siete módulos atómicos bajo `src/modules/` que se integran a través del
patrón **Store** de Zustand y del hook personalizado **`usePlantGrowth`**:

| Módulo     | Responsabilidad                                            |
| ---------- | ---------------------------------------------------------- |
| `timer`    | Estado reactivo del contador + orquestación de `finish()`  |
| `plants`   | Registro de 10 especies + cálculo de etapas de crecimiento |
| `history`  | Persistencia y carga del histórico vía Tauri IPC → SQLite  |
| `subjects` | Materias etiquetables por sesión (Mathematics, Reading, …) |
| `audio`    | Efectos de sonido (SFX)                                    |
| `music`    | Canales independientes de música ambiental                 |
| `settings` | Preferencias del usuario (volumen, idioma, etc.)           |

## 4. Arquitectura en capas — flujo de integración

```
┌──────────────────────────────────────┐
│  Presentación (.tsx, React 19)       │  ← componentes sin lógica de negocio
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  Lógica / Estado (Zustand 5)         │  ← timerStore, plantService, historyStore
│   • finish() → calculateFinalStage() │
│   • saveSession() → syncHearts()     │
└──────────────┬───────────────────────┘
               │  Tauri IPC (save_session, get_user_state)
┌──────────────▼───────────────────────┐
│  Acceso a Datos (Rust / rusqlite)    │  ← src-tauri/src/db.rs → SQLite
└──────────────────────────────────────┘
```

Patrones aplicados: **Store** (estado global), **Service Layer**
(`plantService`), **IPC Bridge** (comandos nativos) y **Hook compuesto**
(`usePlantGrowth` une `timer` y `plants` reactivamente).

## 5. Pruebas unitarias y de integración

**Archivo:** `src/modules/timer/timerStore.test.ts`

| Bloque                        | Cobertura                                       |
| ----------------------------- | ----------------------------------------------- |
| Transiciones de estado        | `idle → running → paused → finished`            |
| Fórmula de corazones (matriz) | 25 min → 5 ♥, 4 min → 0 ♥, 60 min → 12 ♥        |
| Umbral de desbloqueo (HU-02)  | `durationMinutes >= threshold * 0.8`            |
| Sincronización `syncHearts()` | `historyStore` actualiza el balance consistente |

Ejecución:

```bash
pnpm install
pnpm test
# Salida esperada: tests verdes (timerStore.test.ts y resto del suite)
```

## 6. Backend alternativo SENA (Node.js / Express)

Para cumplir con la exigencia académica de "servicios web" del SENA se
incluye también el módulo `sena-backend/` (puerto 3001):

| Endpoint             | Método | Descripción                                     |
| -------------------- | ------ | ----------------------------------------------- |
| `/api/auth/register` | POST   | Registro con hashing SHA-256                    |
| `/api/auth/login`    | POST   | Login con validación de credenciales            |
| `/api/auth/status`   | GET    | Health-check                                    |
| `/api/plants`        | CRUD   | GET / POST / PUT / DELETE (respuestas saneadas) |

Códigos HTTP esperados: 200, 201, 400, 401, 409.

## 7. Cómo levantar el proyecto (ambiente de desarrollo)

```bash
# 1. Frontend + Tauri (aplicación de escritorio)
pnpm install
pnpm dev              # Vite dev server en http://localhost:1420
pnpm tauri dev        # Aplicación desktop empaquetada (opcional)

# 2. Backend SENA (Node.js / Express)
cd sena-backend
npm install
npm start             # Servidor en http://localhost:3001

# 3. Pruebas
pnpm test             # Vitest (frontend)
cd sena-backend && npm test    # Tests del backend (10/10 esperados)
```

## 8. Archivos clave para la revisión

- `DESARROLLO.md` — informe técnico completo (este ZIP)
- `src/modules/` — 7 módulos integrados
- `src/modules/timer/timerStore.ts` — orquestador `finish()`
- `src/hooks/usePlantGrowth.ts` — hook de integración timer↔plants
- `src/modules/timer/timerStore.test.ts` — suite de pruebas integradas
- `src-tauri/src/db.rs` — capa de acceso a datos (Rust/SQLite)
- `sena-backend/src/routes/auth.js` — mecanismos de seguridad
- `docs/architecture.md` — diagrama y descripción de arquitectura
- `package.json` — frameworks y versiones (React, Zustand, Vite, Vitest)

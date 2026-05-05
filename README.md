# Minu's Garden

App de escritorio para sesiones de estudio con jardín virtual.

> Proyecto personal. No acepta contribuciones externas.

## Stack

- **Frontend:** React 19 + TypeScript 5.8
- **Estilos:** CSS Vanilla (Custom Properties + BEM)
- **Estado:** Zustand 5
- **Audio:** Howler 2
- **Desktop shell:** Tauri 2 (Rust)
- **Persistencia:** SQLite (via Rusqlite en Rust)
- **Build:** Vite 7
- **Tests:** Vitest 4 + @testing-library/react + jsdom

## Estructura

```
src/
├── components/       # primitivas UI compartidas (header, iconos, panel, ...)
├── i18n/             # traducciones EN/ES y tipos
├── lib/              # infra cross-cutting (bridge Tauri tipado, toasts)
├── modules/          # features con barrel index.ts en cada una
│   ├── audio/
│   ├── history/
│   ├── music/
│   ├── plants/
│   ├── settings/
│   ├── subjects/
│   └── timer/
├── styles/           # variables CSS y estilos globales
├── App.tsx
└── main.tsx
src-tauri/            # backend Rust + comandos IPC + esquema SQLite
docs/                 # arquitectura, ADRs, requirements, palette, vision
test/                 # setup global de Vitest
```

Boundaries: el código fuera de un módulo solo puede importar desde su
barrel (`@/modules/<name>`). Los imports profundos `@/modules/<name>/<archivo>`
están prohibidos por ESLint. Imports intra-módulo deben ser relativos.

## Setup

```bash
pnpm install
```

`pnpm install` corre `prepare` y activa los hooks de pre-commit
(simple-git-hooks + lint-staged).

## Scripts

| Comando              | Para qué sirve                                       |
| -------------------- | ---------------------------------------------------- |
| `pnpm dev`           | Vite dev server (sin Tauri)                          |
| `pnpm tauri dev`     | App de escritorio con HMR                            |
| `pnpm build`         | `tsc && vite build` (frontend de producción)         |
| `pnpm tauri build`   | Bundle nativo (Windows/macOS/Linux)                  |
| `pnpm typecheck`     | `tsc --noEmit`                                       |
| `pnpm lint`          | ESLint (flat config, type-aware)                     |
| `pnpm lint:fix`      | ESLint con autofix                                   |
| `pnpm format`        | Prettier write                                       |
| `pnpm format:check`  | Prettier check                                       |
| `pnpm validate`      | typecheck + lint + format:check                      |
| `pnpm circular`      | madge — verifica que no haya dependencias circulares |
| `pnpm test`          | Vitest (run único)                                   |
| `pnpm test:watch`    | Vitest en modo watch                                 |
| `pnpm test:coverage` | Vitest con cobertura V8 + thresholds (60%)           |

Antes de abrir un PR: `pnpm validate && pnpm circular && pnpm test:coverage && pnpm build`.

## Convenciones

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `build:`, `ci:`).
- **Ramas:** `feat/<scope>`, `fix/<scope>`, `refactor/<scope>`, `chore/<scope>`, `docs/<scope>`.
- **Idioma:** documentación, comentarios y CHANGELOG en español; identificadores, mensajes de commit y nombres de archivos en inglés.
- **PRs:** un objetivo por PR, ≤ 400 LOC netas (excepción: PRs de consolidación con commits atómicos). Squash merge obligatorio; **el título del PR es el commit que llega a `main`** y lo que release-please parsea. Plantilla en [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).
- **ADRs:** decisiones arquitectónicas en [docs/adr/](docs/adr/) usando la plantilla MADR.

## Releases y Versionado

Este proyecto usa [release-please](https://github.com/googleapis/release-please) para gestionar el versionado semántico y el changelog automáticamente.

- Cada squash merge a `main` dispara el workflow [.github/workflows/release-please.yml](.github/workflows/release-please.yml).
- release-please analiza el commit squasheado (cuyo mensaje es el título del PR, en formato Conventional Commits) y abre un PR de release titulado `chore(main): release X.Y.Z` con `CHANGELOG.md` actualizado y la versión bumpeada en `package.json`, `src-tauri/Cargo.toml` y `src-tauri/tauri.conf.json`.
- Al mergear ese PR de release se crea automáticamente el tag `vX.Y.Z` y el GitHub Release correspondiente.

Prefijos de commit relevantes para el versionado (mientras estemos en `0.x`):

| Prefijo                       | Efecto                                                             |
| ----------------------------- | ------------------------------------------------------------------ |
| `fix:`                        | Patch bump (`0.0.x`)                                               |
| `feat:`                       | Minor bump (`0.x.0`)                                               |
| `feat!:` / `BREAKING CHANGE:` | Minor bump en `0.x`; major bump (`x.0.0`) cuando lleguemos a `1.0` |

Para el flujo paso a paso ver [docs/playbook.md §6 y §10](docs/playbook.md).

## Más documentación

- **Playbook operativo** (qué hago, en qué orden, con qué comando): [docs/playbook.md](docs/playbook.md)
- Arquitectura: [docs/architecture.md](docs/architecture.md)
- Visión: [docs/vision.md](docs/vision.md)
- Requirements y sprints: [docs/requirements.md](docs/requirements.md)
- Paleta de diseño: [docs/palette.md](docs/palette.md)
- Decisiones (ADRs): [docs/adr/](docs/adr/)
- Cambios: [CHANGELOG.md](CHANGELOG.md)
- Cómo contribuir (uso interno): [CONTRIBUTING.md](CONTRIBUTING.md)

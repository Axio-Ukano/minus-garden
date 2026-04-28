# Contribuir a Minu's Garden

> Documento interno. Este es un proyecto personal privado y no acepta contribuciones externas. Esta guía existe para que el autor (y cualquier colaborador puntual autorizado) trabaje de forma consistente.

## Flujo de trabajo

1. Salir de `main` con `git pull`.
2. Crear rama: `feat/<scope>`, `fix/<scope>`, `refactor/<scope>`, `chore/<scope>` o `docs/<scope>`.
3. Trabajar en commits atómicos siguiendo Conventional Commits.
4. Antes de cada commit (lo hace el hook automáticamente vía lint-staged):
   - `eslint --fix --max-warnings=0` sobre los archivos staged.
   - `prettier --write` sobre los archivos staged.
5. Antes de abrir el PR:
   ```bash
   pnpm validate
   pnpm circular
   pnpm test:coverage
   pnpm build
   ```
   Todos en verde.
6. Si la app cambió en runtime: smoke manual con `pnpm tauri dev` (timer 1 min → guardar → ver en history → hearts +X).
7. Abrir PR contra `main` siguiendo la plantilla. Squash merge.
8. Tras merge: actualizar CHANGELOG y, si aplica, taggear `vX.Y.Z`.

## Conventional Commits

Prefijos válidos: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `build`, `ci`.
Mensajes en inglés (alineado con el historial). Una línea de subject ≤ 72 chars.

Ejemplos:

```
feat(timer): add per-subject grace period
fix(history): clamp totalHearts to non-negative
chore(deps): bump zustand to 5.1
refactor(audio): extract howl factory to module
docs(adr): record CSP policy decision
```

## Tamaño y estilo de PR

- Un solo objetivo por PR. ≤ 400 LOC netas.
- Excepción explícita: PRs de **consolidación / "tier S"** con commits atómicos perfectamente ordenados (ver `feat/tier-s-consolidation` v0.5.0 como referencia).
- Cada commit individual debe dejar el repo verde (`pnpm validate && pnpm build`).
- No usar `--no-verify`. Si un hook falla, corregir la causa.

## ESLint y reglas no negociables

- Sin `any` (`no-explicit-any: error`).
- Sin variables no usadas (`no-unused-vars: error`, ignora `^_`).
- Promesas no awaited deben prefijarse con `void`, encadenar `.catch()` o ser `await`-eadas (`no-floating-promises`, `no-misused-promises`).
- Imports cross-módulo solo desde el barrel (`@/modules/<name>`). Imports profundos prohibidos.
- Sin dependencias circulares (`pnpm circular`).

## TypeScript

- `strict` activado, junto con `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- Nuevos tipos cross-módulo van en el barrel del módulo dueño.
- Evitar `as` salvo en boundaries (deserializar IPC, casts a `unknown` antes de tipos concretos en tests).

## Cuándo añadir un ADR

Crea un nuevo `docs/adr/NNNN-<slug>.md` (basado en `docs/adr/0000-template.md`) cuando:

- Añades o quitas una dependencia top-level.
- Cambias un boundary entre módulos.
- Modificas el bridge Tauri o la firma pública de comandos.
- Cambias el esquema SQLite (incluye plan de migración).
- Tomas una decisión arquitectónica que requiere contexto futuro (paleta, i18n, persistencia, etc.).

## Documentación viva

- README: setup y scripts.
- CHANGELOG: una entrada por release con secciones `Added/Changed/Fixed/Removed`.
- `docs/architecture.md`: capa por capa, debe reflejar el estado real del repo.
- `docs/requirements.md`: hitos por sprint.

Al abrir un PR que cambia el comportamiento o la arquitectura, actualiza la documentación afectada en el mismo PR.

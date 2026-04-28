# ADR-0004: Boundaries entre módulos y alias `@/*`

- **Estado:** Aceptada
- **Fecha:** 2026-04-27
- **Decisores:** @autor

## Contexto

El código frontend está organizado por feature en `src/modules/<name>/`. En sprints previos al "tier S", los boundaries entre módulos se respetaban por convención humana (review manual). Sin enforcement automático, el riesgo de regresión era alto: cualquier PR podía importar internals de otro módulo y romper el encapsulado sin que CI lo notara.

## Decisión

1. Cada módulo expone su superficie pública via `src/modules/<name>/index.ts` (barrel).
2. Los imports cross-módulo deben ir por el barrel y por el alias `@/modules/<name>`. Está prohibido `@/modules/<name>/<archivo-interno>`.
3. Los imports intra-módulo deben usar paths relativos (`./`, `../`). Nunca `@/modules/<self>/<...>` para evitar el round-trip por el barrel.
4. El path alias `@/*` apunta a `src/*` (configurado en `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` y `eslint-import-resolver-typescript`).
5. Enforcement automático:
   - ESLint regla `no-restricted-imports` con patrón `@/modules/*/*` en error.
   - ESLint regla `import/no-cycle` en error.
   - Script `pnpm circular` (madge) en CI como red secundaria.

## Consecuencias

### Positivas

- El encapsulado se vuelve mecánico: el linter rompe builds y CI bloquea PRs que crucen boundaries.
- Refactor interno de un módulo es seguro mientras el barrel mantenga su contrato.
- Los tests pueden mockear módulos completos por path estable (`vi.mock("@/modules/audio")`).

### Negativas

- Añadir una nueva exportación cross-módulo requiere actualizar el barrel — más fricción que un import directo.
- Tipos cross-módulo deben declararse o reexportarse desde el barrel; no se puede importar tipos profundos.

### Neutras

- Tests unitarios no escapan a la regla; usan paths relativos intra-módulo y barrel para mocks externos.

## Alternativas consideradas

### Solo barrel sin enforcement

Lo que teníamos antes del sprint tier S. Probadamente erosiona con el tiempo.

### `eslint-plugin-boundaries`

Más expresivo (definir tipos de elementos y reglas de qué tipo puede importar a qué tipo). Descartado por overhead de configuración para una app de 7 módulos.

### Workspaces (pnpm workspaces) por módulo

Cada feature como paquete independiente. Aísla más, pero introduce un monorepo donde no se necesita y complica el build de Tauri.

## Notas

- Para añadir un módulo nuevo:
  1. Crear `src/modules/<name>/` con sus archivos internos.
  2. Crear `src/modules/<name>/index.ts` exportando solo lo público.
  3. Documentar en `docs/architecture.md` su lugar en la pila.
  4. Si añade un boundary nuevo no obvio (ej. el módulo solo puede ser usado por X), abrir un ADR adicional.

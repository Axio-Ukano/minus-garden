# ADR-0004: Module boundaries and the `@/*` alias

- **Status:** Accepted
- **Date:** 2026-04-27
- **Deciders:** @author

## Context

The frontend code is organized by feature under `src/modules/<name>/`. In updates prior to "tier S", boundaries between modules were respected by human convention (manual review). Without automatic enforcement, the risk of regression was high: any PR could import internals from another module and break encapsulation without CI noticing.

## Decision

1. Each module exposes its public surface via `src/modules/<name>/index.ts` (barrel).
2. Cross-module imports must go through the barrel and the `@/modules/<name>` alias. Importing `@/modules/<name>/<internal-file>` is forbidden.
3. Intra-module imports must use relative paths (`./`, `../`). Never `@/modules/<self>/<...>` to avoid the round-trip through the barrel.
4. The path alias `@/*` points to `src/*` (configured in `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, and `eslint-import-resolver-typescript`).
5. Automatic enforcement:
   - ESLint rule `no-restricted-imports` with pattern `@/modules/*/*` as error.
   - ESLint rule `import/no-cycle` as error.
   - Script `pnpm circular` (madge) in CI as a secondary net.

## Consequences

### Good

- Encapsulation becomes mechanical: the linter breaks builds and CI blocks PRs that cross boundaries.
- Internal refactoring of a module is safe as long as the barrel maintains its contract.
- Tests can mock complete modules by stable path (`vi.mock("@/modules/audio")`).

### Bad

- Adding a new cross-module export requires updating the barrel — more friction than a direct import.
- Cross-module types must be declared or re-exported from the barrel; deep types cannot be imported directly.

### Neutral

- Unit tests are not exempt from the rule; they use relative intra-module paths and the barrel for external mocks.

## Considered Alternatives

### Barrel only, without enforcement

What we had before the tier S update. Proven to erode over time.

### `eslint-plugin-boundaries`

More expressive (define element types and rules for which type can import from which). Discarded due to configuration overhead for an app with 7 modules.

### Workspaces (pnpm workspaces) per module

Each feature as an independent package. Provides stronger isolation but introduces a monorepo where it is not needed and complicates the Tauri build.

## Notes

- To add a new module:
  1. Create `src/modules/<name>/` with its internal files.
  2. Create `src/modules/<name>/index.ts` exporting only public items.
  3. Document it in `docs/architecture.md` and its place in the stack.
  4. If it adds a non-obvious new boundary (e.g. the module can only be used by X), open an additional ADR.

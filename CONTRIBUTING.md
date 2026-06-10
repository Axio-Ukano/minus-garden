# Contributing to Minu's Garden

> Internal document. This is a private personal project and does not accept external contributions. This guide exists so the author (and any occasional authorized collaborator) works consistently.

> For the step-by-step flow (how to open a PR, validate, merge, tag, hotfix, rollback) see [docs/playbook.md](docs/playbook.md). This document only lists the **rules**; the playbook lists the **steps**.

## Workflow

1. Start from `main` with `git pull`.
2. Create a branch: `feat/<scope>`, `fix/<scope>`, `refactor/<scope>`, `chore/<scope>` or `docs/<scope>`.
3. Work in atomic commits following Conventional Commits.
4. Before each commit (the hook does this automatically via lint-staged):
   - `eslint --fix --max-warnings=0` on the staged files.
   - `prettier --write` on the staged files.
5. Before opening the PR:
   ```bash
   pnpm validate
   pnpm circular
   pnpm test:coverage
   pnpm build
   ```
   All green.
6. If the app changed at runtime: manual smoke with `pnpm tauri dev` (timer 1 min → save → see it in history → hearts +X).
7. Open a PR against `main` following the template. Squash merge.
8. After merge: update the CHANGELOG and, if applicable, tag `vX.Y.Z`.

## Conventional Commits

Valid prefixes: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `build`, `ci`.
Messages in English. Subject line ≤ 72 chars.

Examples:

```
feat(timer): add per-subject grace period
fix(history): clamp totalHearts to non-negative
chore(deps): bump zustand to 5.1
refactor(audio): extract howl factory to module
docs(adr): record CSP policy decision
```

## PR size and style

- One single goal per PR. ≤ 400 net LOC.
- Explicit exception: **consolidation / "tier S"** PRs with perfectly ordered atomic commits (see `feat/tier-s-consolidation` v0.5.0 as a reference).
- Every individual commit must leave the repo green (`pnpm validate && pnpm build`).
- Do not use `--no-verify`. If a hook fails, fix the cause.

## ESLint and non-negotiable rules

- No `any` (`no-explicit-any: error`).
- No unused variables (`no-unused-vars: error`, ignores `^_`).
- Unawaited promises must be prefixed with `void`, chain `.catch()`, or be `await`-ed (`no-floating-promises`, `no-misused-promises`).
- Cross-module imports only from the barrel (`@/modules/<name>`). Deep imports forbidden.
- No circular dependencies (`pnpm circular`).

## TypeScript

- `strict` enabled, alongside `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- New cross-module types go in the owning module's barrel.
- Avoid `as` except at boundaries (deserializing IPC, casts through `unknown` before concrete types in tests).

## When to add an ADR

Create a new `docs/adr/NNNN-<slug>.md` (based on `docs/adr/0000-template.md`) when you:

- Add or remove a top-level dependency.
- Change a boundary between modules.
- Modify the Tauri bridge or the public command signatures.
- Change the SQLite schema (include the migration plan).
- Make an architectural decision that needs future context (palette, i18n, persistence, etc.).

## Living documentation

- README: setup and scripts.
- CHANGELOG: one entry per release with `Added/Changed/Fixed/Removed` sections.
- `docs/architecture.md`: layer by layer, must reflect the real state of the repo.
- `docs/requirements.md`: milestones per sprint.

When opening a PR that changes behavior or architecture, update the affected documentation in the same PR.

## Language

Everything in the repository is in English: documentation, code comments, CHANGELOG, identifiers, commit messages, PR titles/bodies and file names. The only Spanish that lives in the codebase is `src/i18n/es.ts` (the user-facing Spanish locale) and the species IDs persisted in SQLite (kept for backward compatibility — see [docs/adr/](docs/adr/)).

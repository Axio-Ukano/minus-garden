# Minu's Garden

Desktop app for study sessions with a virtual garden.

> Personal project. Does not accept external contributions.

## Stack

- **Frontend:** React 19 + TypeScript 6
- **Styles:** Vanilla CSS (Custom Properties + BEM)
- **State:** Zustand 5
- **Audio:** Howler 2
- **Desktop shell:** Tauri 2 (Rust)
- **Persistence:** SQLite (via Rusqlite in Rust)
- **Build:** Vite 8
- **Tests:** Vitest 4 + @testing-library/react + jsdom

## Structure

```
src/
├── components/       # shared UI primitives (header, icons, panel, ...)
├── i18n/             # EN/ES translations and types
├── lib/              # cross-cutting infra (typed Tauri bridge, toasts)
├── modules/          # features, each with a barrel index.ts
│   ├── audio/
│   ├── history/
│   ├── music/
│   ├── plants/
│   ├── settings/
│   ├── subjects/
│   └── timer/
├── styles/           # CSS variables and global styles
├── App.tsx
└── main.tsx
src-tauri/            # Rust backend + IPC commands + SQLite schema
docs/                 # architecture, ADRs, requirements, palette, vision
test/                 # global Vitest setup
```

Boundaries: code outside a module may only import from that module's
barrel (`@/modules/<name>`). Deep imports `@/modules/<name>/<file>` are
forbidden by ESLint. Intra-module imports must be relative.

## Setup

```bash
pnpm install
```

`pnpm install` runs `prepare`, which activates the pre-commit hooks
(simple-git-hooks + lint-staged).

## Scripts

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `pnpm dev`           | Vite dev server (no Tauri)                        |
| `pnpm tauri dev`     | Desktop app with HMR                              |
| `pnpm build`         | `tsc && vite build` (production frontend)         |
| `pnpm tauri build`   | Native bundle (Windows/macOS/Linux)               |
| `pnpm typecheck`     | `tsc --noEmit`                                    |
| `pnpm lint`          | ESLint (flat config, type-aware)                  |
| `pnpm lint:fix`      | ESLint with autofix                               |
| `pnpm format`        | Prettier write                                    |
| `pnpm format:check`  | Prettier check                                    |
| `pnpm validate`      | typecheck + lint + format:check                   |
| `pnpm circular`      | madge — checks there are no circular dependencies |
| `pnpm test`          | Vitest (single run)                               |
| `pnpm test:watch`    | Vitest in watch mode                              |
| `pnpm test:coverage` | Vitest with V8 coverage + thresholds (60%)        |

Before opening a PR: `pnpm validate && pnpm circular && pnpm test:coverage && pnpm build`.

## Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `build:`, `ci:`).
- **Branches:** `feat/<scope>`, `fix/<scope>`, `refactor/<scope>`, `chore/<scope>`, `docs/<scope>`.
- **Language:** everything in English — documentation, code comments, CHANGELOG, identifiers, commit messages, PR titles/bodies and file names. The only Spanish in the repo lives in `src/i18n/es.ts` (the user-facing Spanish locale) and in DB-facing species IDs kept for backward compatibility.
- **PRs:** one goal per PR, ≤ 400 net LOC (exception: consolidation PRs with atomic commits). Squash merge is mandatory; **the PR title is the commit that lands on `main`** and what release-please parses. Template in [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).
- **ADRs:** architectural decisions in [docs/adr/](docs/adr/) using the MADR template.

## Releases & Versioning

This project uses [release-please](https://github.com/googleapis/release-please) to manage semantic versioning and the changelog automatically.

- Every squash merge to `main` triggers the [.github/workflows/release-please.yml](.github/workflows/release-please.yml) workflow.
- release-please parses the squashed commit (whose message is the PR title, in Conventional Commits format) and opens a release PR titled `chore(main): release X.Y.Z` with an updated `CHANGELOG.md` and the version bumped in `package.json`, `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json`.
- Merging that release PR automatically creates the `vX.Y.Z` tag and the corresponding GitHub Release.

Commit prefixes relevant to versioning (while we are on `0.x`):

| Prefix                        | Effect                                                        |
| ----------------------------- | ------------------------------------------------------------- |
| `fix:`                        | Patch bump (`0.0.x`)                                          |
| `feat:`                       | Minor bump (`0.x.0`)                                          |
| `feat!:` / `BREAKING CHANGE:` | Minor bump on `0.x`; major bump (`x.0.0`) once we reach `1.0` |

For the step-by-step flow see [docs/playbook.md §6 and §10](docs/playbook.md).

## More documentation

- **Operational playbook** (what I do, in what order, with which command): [docs/playbook.md](docs/playbook.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- Vision: [docs/vision.md](docs/vision.md)
- Requirements and sprints: [docs/requirements.md](docs/requirements.md)
- Design palette: [docs/palette.md](docs/palette.md)
- Decisions (ADRs): [docs/adr/](docs/adr/)
- Changes: [CHANGELOG.md](CHANGELOG.md)
- How to contribute (internal use): [CONTRIBUTING.md](CONTRIBUTING.md)

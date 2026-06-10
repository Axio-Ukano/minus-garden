# Operational playbook — minus-garden

> Canonical document for "what I do, in what order, with which command" for all work in the repo. It lives here; `README.md` and `CONTRIBUTING.md` only link to this file.
>
> **Since May 2026 the repo is public**, with branch protection on `main`: squash-only merging, required CI checks, no direct push or bypass. Every change goes through a PR.

---

## 0. Per-machine setup (one time only)

```bash
pnpm install      # installs deps + activates pre-commit hooks (lint-staged)
gh auth status    # confirm GitHub CLI authentication
pnpm validate     # must pass on main before touching anything
```

If `pnpm install` doesn't activate the hooks (uncommon), run `pnpm exec simple-git-hooks` manually.

VS Code automatically installs the recommended extensions (`tauri-vscode`, `rust-analyzer`, `vscode-eslint`, `prettier-vscode`) the first time you open the repo.

---

## 1. Starting a work session

```bash
git checkout main
git pull --ff-only
git fetch --tags
```

Verify the tree is clean (`git status` empty). If not, decide: stash, commit, or discard before starting.

---

## 2. Create a branch

Mandatory naming:

| Prefix      | For what                                       |
| ----------- | ---------------------------------------------- |
| `feat/`     | new user-visible feature                       |
| `fix/`      | bug fix                                        |
| `refactor/` | restructuring with no functional change        |
| `chore/`    | tooling, deps, configuration, build            |
| `docs/`     | documentation only                             |
| `test/`     | add or adjust tests without touching prod code |
| `ci/`       | GitHub Actions workflows                       |

```bash
git checkout -b <prefix>/<short-scope>
# examples:
git checkout -b feat/notification-on-finish
git checkout -b fix/history-view-empty-state
git checkout -b chore/bump-tauri-2.1
```

---

## 3. During development

### Inner loop

```bash
pnpm dev          # fast frontend iteration (no Tauri)
pnpm tauri dev    # iteration with the real app (heavier but reflects IPC and CSP)
pnpm test:watch   # live tests if you touch stores/lib
pnpm typecheck    # quick type check
```

### Commits

- Conventional Commits **in English**.
- One goal per commit. If you touch two things, split the commit.
- `git commit -m "feat(scope): subject ≤ 72 chars"` — the commit body is for the "why", not the "what".
- The pre-commit hook runs automatically:
  1. `eslint --fix --max-warnings=0` on staged `*.ts|*.tsx` files.
  2. `prettier --write` on staged `*.{ts,tsx,js,json,css,md,yml,yaml}` files.
- If the hook fails: **fix the cause**. Do not use `--no-verify`.

> **⚠ With squash merge, the PR title is what lands on `main`** (not the individual commits). The branch commits are useful for review, but release-please only sees the squashed commit — whose message is the PR title. That's why the title **must** follow Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, etc.

### Non-negotiable code rules

- No `any` (`@typescript-eslint/no-explicit-any: error`).
- No unused variables or parameters (`no-unused-vars: error`, ignores `^_`).
- Unawaited promises must carry `void`, `.catch(...)` or be `await`-ed.
- Cross-module imports only from the barrel: `@/modules/<name>`. Deep imports (`@/modules/<name>/<file>`) are blocked by ESLint.
- Intra-module imports: relative (`./...`, `../...`).
- No circular dependencies.
- TypeScript strict + `noUncheckedIndexedAccess`: any index or dynamic-key access returns `T | undefined`; handle it with an explicit guard or `?? fallback`.

---

## 4. Before opening the PR — local gate

Run **everything** in this order until it passes green:

```bash
pnpm install --frozen-lockfile     # only if you touched deps; validates the lockfile in a clean clone
pnpm validate                       # typecheck + lint + format:check
pnpm circular                       # 0 cycles
pnpm test:coverage                  # tests + coverage ≥ 60% on covered modules
pnpm build                          # tsc + vite build
```

If you touched UI or IPC, **manual smoke is mandatory** with the real app:

```bash
pnpm tauri dev
```

Minimum smoke path:

1. Create a 1-minute session, let it run, confirm it reaches `finished`.
2. Verify it appears in `History` and that the hearts counter went up in the header.
3. Switch language EN/ES in `Settings`; confirm the header and `History` are translated.
4. Test volumes in `Settings` (master, music, ambient, sfx); close and reopen; they must persist.
5. Start/pause music in the `MiniPlayer`; change track.
6. If you touched the backend or CSP: force an error (kill the DB by hand or rename the `.db`) and confirm an error toast appears instead of a crash.

If any of this breaks, you don't open the PR — investigate the cause first.

---

## 5. Documentation updated within the same PR

| When you change…                           | You update…                                                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| folder structure or layers                 | `docs/architecture.md`                                                                                         |
| Tauri commands or SQLite schema            | `docs/architecture.md` + ADR if the signature changes                                                          |
| top-level dependencies (frontend or Rust)  | `package.json` / `Cargo.toml` + ADR if the decision is not obvious                                             |
| module boundaries or ESLint rules          | `docs/architecture.md` + ADR                                                                                   |
| visible stack (React/Vite/Tauri/...)       | `README.md` and `docs/architecture.md`                                                                         |
| scripts in `package.json`                  | `README.md`                                                                                                    |
| the scope of a sprint                      | `docs/requirements.md`                                                                                         |
| anything that deserves future traceability | new `docs/adr/NNNN-<slug>.md` based on `docs/adr/0000-template.md`                                             |
| user-visible behavior                      | the commit message (`feat:` / `fix:`) with a readable description — release-please carries it to the CHANGELOG |

### When to create an ADR (rule of thumb)

If your change answers "yes" to any of these, an ADR is needed:

- Does it add or remove a top-level dependency?
- Does it change a boundary between modules?
- Does it modify the Tauri bridge or the public signature of a command?
- Does it change the SQLite schema (include the migration plan)?
- Does it make a technical decision I'll want to understand 6 months from now without reading the whole diff?

Numbering: the next free integer after the last ADR.

---

## 6. Versioning and CHANGELOG strategy

Versioning and `CHANGELOG.md` are managed by [release-please](https://github.com/googleapis/release-please) automatically from the merge to `main`. The author's only rule is to write Conventional Commits **in English** correctly: release-please computes the bump, syncs `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json` and rewrites `CHANGELOG.md`.

### Bump table (while we are on `0.x`)

| Commit prefix                                         | Bump                             | Appears in CHANGELOG under |
| ----------------------------------------------------- | -------------------------------- | -------------------------- |
| `fix:`                                                | patch                            | Fixed                      |
| `feat:`                                               | minor                            | Added                      |
| `feat!:` or `BREAKING CHANGE:` in the body            | minor on `0.x` · major on `1.0+` | Added                      |
| `perf:`, `refactor:`, `deps:`                         | no bump                          | Changed                    |
| `revert:`                                             | no bump                          | Removed                    |
| `chore:`, `docs:`, `test:`, `ci:`, `build:`, `style:` | no bump                          | (hidden)                   |

`bump-minor-pre-major: true` and `bump-patch-for-minor-pre-major: false` are defined in `release-please-config.json`: while the version is `0.x`, a `feat:` bumps minor (not patch) and a breaking change bumps minor (not major). When moving to `1.0` the rule inverts — delete that flag then.

### CHANGELOG.md

- Auto-generated by release-please. It is in `.prettierignore` so it doesn't fight with the bot's formatting.
- Language: **English**. The section labels (`Added / Changed / Fixed / Removed`) come from `changelog-sections` in `release-please-config.json`. The file header (all the text above the first `## [X.Y.Z]` entry) is preserved intact — release-please only inserts new entries below it, never overwrites that header.
- The bullets inside each entry come from each commit subject and are therefore in English (consistent with the English Conventional Commits rule in §3).
- The pre-`0.5.0` history is manual and stays intact below the auto-generated entries.

### Versioning flow

1. You merge any PR to `main` with English Conventional Commit titles.
2. If those commits justify a bump (`feat:`, `fix:`, breaking change), `release-please.yml` opens or updates a PR titled `chore(main): release X.Y.Z` with all files synced.
3. You review that PR (it's readable: it has the `CHANGELOG.md` ready). If it's fine, you merge it.
4. On merge, the workflow creates the `vX.Y.Z` tag and the GitHub Release automatically.
5. If the original PR only had `chore`/`docs`/`test`/`ci`/`build`/`style`, nothing happens — the next PR with a `feat`/`fix` will pick up the pending notes.

---

## 7. Opening the PR

```bash
git push -u origin <branch>
gh pr create --base main --head <branch> --title "<conv-commit-style title>" --body "<summary>"
```

**The PR title is critical**: because main uses squash merge, the title becomes the only commit on `main`. release-please parses it to decide the bump. Make sure it follows Conventional Commits: `feat(timer): add pause shortcut`, `fix(audio): prevent double-play on unmount`, etc.

The body must follow `.github/PULL_REQUEST_TEMPLATE.md`:

- Summary 1-3 lines.
- Type of change.
- Validation checklist (all green).
- Scope checks — keep only the lines that apply and delete the rest; never open a PR with boxes that can't be checked.
- Screenshots/video if it affected the UI.
- Notes for the reviewer.

Pass the full body from a file with `--body-file <path>` to keep the template formatting intact.

---

## 8. Wait for CI

```bash
gh pr checks <PR#> --watch
```

The `validate.yml` workflow runs: `pnpm install --frozen-lockfile` → `typecheck` → `lint` → `format:check` → `circular` → `test:coverage` → `build`. Takes ~1 minute.

**Branch protection requires green checks** — the merge button is blocked until CI passes. There is no bypass, not even for admins.

If CI breaks on something that doesn't fail locally, it's almost always:

- `pnpm install --frozen-lockfile` rejects the lockfile (deps drift) → resolve locally, recommit.
- Platform difference (local Windows vs Ubuntu CI): paths with `\` vs `/`, line endings, case-sensitive resolves.
- Coverage threshold breaks because `include` doesn't cover a new file.

Fix and re-push.

---

## 9. Merge

```bash
gh pr merge <PR#> --squash --delete-branch
```

- `--squash` is the **only enabled strategy** in the repo. Merge commits and rebase are disabled in Settings → General.
- All branch commits are squashed into a single one whose message is the PR title. The `main` history stays linear: one commit = one PR = one unit of change.
- `--delete-branch`: deletes the remote branch (the branch is also auto-deleted by repo config, but the flag cleans up the local reference).

> **Consequence for release-please**: since each PR produces a single commit on `main`, the PR title (which becomes the squashed commit message) is what release-please parses. A PR titled `feat(garden): add watering animation` produces a minor bump. One with `chore: update deps` produces none.

---

## 10. Post-merge

```bash
git checkout main
git pull --ff-only
```

### The `release-please` workflow runs on its own

After the (squash) merge to `main`, `.github/workflows/release-please.yml` runs and, if the squashed commit justifies a bump (by its title/prefix), opens (or updates) a PR titled `chore(main): release X.Y.Z`.

That PR already includes:

- bumped `package.json`.
- bumped `src-tauri/Cargo.toml`.
- bumped `src-tauri/tauri.conf.json`.
- `CHANGELOG.md` with the new entry.

All you have to do:

1. Review the release PR. If the CHANGELOG notes don't read well, edit the title of the original PR (the one that became the commit on `main`) — release-please will regenerate the CHANGELOG on its next run.
2. `gh pr merge <PR#> --squash --delete-branch` the release PR.
3. On merge, the workflow automatically creates the `vX.Y.Z` tag and the GitHub Release.

### `Cargo.lock` syncs on its own

The `release-please.yml` workflow includes a step that syncs `Cargo.lock` automatically inside the release PR (using `sed`, without needing to install Rust in CI). When you review the release PR, `Cargo.lock` is already updated — nothing manual to do.

### If the PR didn't bump the version

Nothing extra. The next PR that closes a release unit with `feat:` or `fix:` will pick up the pending notes.

---

## 11. Hotfix flow

If you find a critical bug on `main` after a release:

```bash
git checkout main && git pull
git checkout -b fix/<short-scope>
# fix + commit with fix: prefix + tests
pnpm validate && pnpm test:coverage && pnpm build
git push -u origin fix/<scope>
gh pr create --base main --head fix/<scope> --title "fix(scope): describe the fix"
gh pr checks <PR#> --watch
gh pr merge <PR#> --squash --delete-branch
```

The PR title (`fix(scope): ...`) becomes the squashed commit on `main`. release-please sees it as `fix:`, opens the `chore(main): release X.Y.(Z+1)` PR with the synced files and the CHANGELOG. You merge that PR and the patch tag/release comes out on its own (see §10).

---

## 12. Rollback

### Revert a commit already on `main`

Since you can't push directly to `main`, the revert goes through a PR:

```bash
git checkout main && git pull
git checkout -b revert/<scope>
git revert <commit-sha>
git push -u origin revert/<scope>
gh pr create --title "revert(scope): undo <description>" --body "Reverts <commit-sha>."
gh pr checks <PR#> --watch
gh pr merge <PR#> --squash --delete-branch
```

Since main uses squash (no merge commits), all commits on `main` are direct — you don't need `-m 1`.

### Delete a mis-placed tag

```bash
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z
gh release delete vX.Y.Z --yes
```

---

## 13. Consolidated per-PR checklist

Run this list mentally before each PR:

- [ ] Started from an up-to-date `main` and created a branch with the correct prefix.
- [ ] Atomic commits, Conventional Commits, in English.
- [ ] **PR title in Conventional Commits** — it's the commit that lands on `main` and what release-please parses.
- [ ] `pnpm validate` green.
- [ ] `pnpm circular` 0 cycles.
- [ ] `pnpm test:coverage` ≥ 60% on covered modules; new tests for new logic.
- [ ] `pnpm build` green.
- [ ] Manual smoke with `pnpm tauri dev` if you touched UI/IPC/CSP.
- [ ] Docs updated (README/architecture/requirements/ADR per the §5 table).
- [ ] CI green (branch protection blocks the merge otherwise).
- [ ] Merge with `--squash` (the only enabled strategy).
- [ ] `git checkout main && git pull` to close the session.
- [ ] If release-please opened `chore(main): release X.Y.Z`, merge it when ready.

---

## 14. Live deferrals (do NOT do until they apply)

These are recorded as conscious decisions in ADRs and `docs/requirements.md`:

- **E2E tests with Playwright** — ✅ DONE (ADR-0009). Suite in `e2e/` over the frontend with faked Tauri transport; runs in `e2e.yml`. To add specs: reuse the POM in `e2e/support/pages.ts` and `data-testid`.
- **Native E2E (tauri-driver + WebdriverIO)** — covers the real IPC→SQLite path that Playwright can't reach. Trigger: when the DB path becomes a recurring source of regressions or public distribution is prepared.
- **`tauri-plugin-log`** — when distributed beyond personal use.
- **`manualChunks` in Vite** — only if the gzip bundle exceeds 200 KB.
- **Self-host the "Press Start 2P" font** — to close `font-src` to `'self'` and simplify the CSP.
- **`SessionRecorder` port** — only if the timer ⇄ history coupling grows.
- **Split of `SoundSection.tsx`** — when a new sub-feature is added.
- **Refactor `App.tsx` to a router-map** — when a 3rd/4th view is added.

Before opening a PR on any of these, re-read the corresponding ADR and confirm the trigger condition is met.

---

## 15. Quick command glossary

```bash
pnpm dev                # Vite without Tauri
pnpm tauri dev          # desktop app with HMR
pnpm build              # tsc + vite build (frontend prod)
pnpm tauri build        # native bundle

pnpm typecheck          # tsc --noEmit
pnpm lint               # ESLint
pnpm lint:fix           # ESLint --fix
pnpm format             # Prettier --write
pnpm format:check       # Prettier --check
pnpm validate           # typecheck + lint + format:check
pnpm circular           # madge --circular
pnpm test               # vitest run
pnpm test:watch         # vitest watch
pnpm test:coverage      # vitest run --coverage (gating ≥60%)

gh pr create --base main --head <branch>
gh pr checks <PR#> --watch
gh pr merge <PR#> --squash --delete-branch

# Releases: handled by release-please in CI. Only for manual rescue:
gh release create vX.Y.Z --target main --title "..." --notes "..."
git tag -a vX.Y.Z -m "..."  &&  git push origin vX.Y.Z
```

---

## 16. Licensing, copyright & signatures

The project ships under **CC BY-NC-ND 4.0** (`SPDX-License-Identifier: CC-BY-NC-ND-4.0`). Authorship is asserted in four places that must stay consistent:

| Surface                 | Where                                                              | Source of truth                                                                                                    |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Full legal text + scope | `LICENSE` (root)                                                   | Creative Commons official text + our preamble                                                                      |
| Per-file headers        | 3-line `//` block atop every first-party `.ts/.tsx/.rs`            | matches the LICENSE notice                                                                                         |
| Public summary          | README "License & Copyright" section                               | links to `LICENSE`                                                                                                 |
| In-app credits          | Settings panel footer (`SettingsModal.tsx`, i18n `settings.about`) | version is **dynamic** via `__APP_VERSION__` (injected from `package.json` in `vite.config.ts`/`vitest.config.ts`) |

### Where new signatures go

- **New first-party `.ts/.tsx/.rs` file** → must start with the 3-line header. The pre-commit gate does not enforce this yet; add it by hand or re-run the one-off header pass over `git ls-files`. Skip generated/vendor files (`node_modules/`, `src-tauri/target/`, `dist/`) and Vite-generated `vite-env.d.ts` (its header is maintained manually).
- **New media/asset you created** → covered by the license automatically (it's original work). **New third-party/placeholder media** → must be carved out: keep it listed under the LICENSE "Scope" note and never assert it as original.
- **In-app version** is never hard-coded — it always reads `__APP_VERSION__`, so release-please bumps flow through to the credits automatically.

### Future considerations & maintenance (any timeframe)

- **Year range.** The header/notice end year (`2026`) is a manual constant in `LICENSE`, the README, every source header, and `SettingsModal.tsx`. When the calendar year of a _substantive_ change rolls over (e.g. first real change in 2027), bump `2024–<new year>` in all four surfaces in one `chore` PR. Consider scripting this (single source → codemod) before the next bump if it becomes tedious.
- **CC-for-code caveat.** Creative Commons officially advises against CC licenses for _software_ (they don't address source-specific concerns like patent grants or warranty-for-code). We accept this trade-off because the goal is "all rights reserved, but transparent," which CC BY-NC-ND expresses well for a non-distributed personal product. If the project ever ships as a real software product, distributes binaries widely, or accepts code contributions, **re-evaluate**: a dual setup (e.g. a source-available/`PolyForm Noncommercial` or proprietary EULA for code + `CC BY-NC-ND` for art/docs) is the usual escalation. Record any switch in an ADR.
- **Identity changes.** If the legal name, alias, or repo URL changes, update all four surfaces together; the header string is the canonical wording to grep for (`Carlos Pico (Axio-Ukano)`).
- **Commercial/permission grants.** CC BY-NC-ND blocks commercial and derivative use; any exception is granted out-of-band in writing. If grants become frequent, add a `COMMERCIAL.md`/contact note rather than loosening the license.
- **Tooling.** Keep the standard SPDX id `CC-BY-NC-ND-4.0` (not a `LicenseRef-` variant) so GitHub/license scanners recognize it. GitHub's "license detected" badge may stay blank because our `LICENSE` is prefixed with a custom preamble — that's expected and acceptable; the SPDX id keeps machine-readability intact.
- **Enforcement gap.** There is currently no CI check that fails when a new source file lacks the header. If header drift becomes real, add a lint step (or a `pre-commit` grep) — deferred until it actually bites.

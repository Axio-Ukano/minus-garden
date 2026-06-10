# Minu's Garden — Requirements & Sprints

## MVP v0.1 — Base functionality

### Study timer

- [x] Configurable timer (durations: 5, 10, 15, 25, 50 min)
- [x] Start, pause and reset
- [x] Automatic session recording on completion
- [x] Subject/topic field with autocomplete and colors

### Hearts economy

- [x] Earn hearts when completing study sessions
- [x] Base formula: 1 heart per 5 completed minutes
- [x] Heart balance visible at all times
- [x] SQLite persistence (User State)

### Virtual garden

- [ ] Garden view with fixed slots (e.g. 6–9 positions)
- [x] Available plants (Daisy, Sunflower and more in later sprints)
- [ ] Buy plants with hearts
- [x] Plants have growth levels (seed → sprout → plant)
- [x] Grow over time / completed sessions

### History

- [x] List of completed sessions
- [x] Date, duration, subject and hearts earned per session
- [x] Deletion of individual sessions

---

## v0.2 — Improvements and content

### Sounds and ambience

- [x] Ambient sounds (Rain, Forest, Café, Fireplace, White Noise)
- [x] Integrated Lofi music with a playlist (6 tracks)
- [x] Sound effects (SFX) for buttons and timer
- [x] Independent volume mixer for Master, Music, Ambient and SFX

### Personalization and UX

- [x] Native dark mode
- [x] Plant positioning (left / right)
- [x] Custom pixel-art cursors
- [x] Error Boundary for failure handling
- [ ] Desktop notifications when a session ends
- [ ] Compact mode (small window with just the timer)

---

## v0.3 — Plant catalog and settings

- [x] Additional species: Gerbera, Lavender, Carnation, Iris, Peony, Cactus, Orchid, Lotus.
- [x] "Plant stages" modal with visible thresholds.
- [x] Ambient selector with optional randomizer (changes track every N min).

---

## v0.4 — Architectural cleanup (Sprints 6–8)

- [x] Sprint 6: Typed Tauri bridge (`tauriInvoke<T>`), localized errors, toast UX.
- [x] Sprint 7: Git normalization (LF line endings, updated `.gitattributes`, removal of stray files).
- [x] Sprint 8: Module boundaries via barrel `index.ts`, `@/*` alias, dead-export cleanup.

---

## v0.5 — Tier S (Sprint 9)

- [x] Drop of unused Tailwind 4 (Vanilla CSS remains the single styling stack).
- [x] Validation scripts: `typecheck`, `format:check`, `lint:fix`, `validate`, `circular`, `test*`.
- [x] `@types/howler` moved to devDependencies; `@types/node` added and `@ts-expect-error` removed from `vite.config.ts`.
- [x] Full migration of cross-module imports to `@/modules/<name>` and intra-module to relative.
- [x] ESLint: `no-explicit-any`/`no-unused-vars` at `error`, type-aware (`no-floating-promises`, `no-misused-promises`), `eslint-plugin-import` with `import/no-cycle` and `no-restricted-imports` for boundaries.
- [x] TypeScript: `noUncheckedIndexedAccess` enabled; fallout fixed.
- [x] madge for cycle detection; `simple-git-hooks` + `lint-staged` in pre-commit.
- [x] Vitest 4 + jsdom + Testing Library + jest-dom; suites for `timerStore`, `plantService`, `usePlantGrowth`, `lib/tauri`, `historyStore`, `audioService`. Coverage on the covered modules: 95% lines, 92% functions.
- [x] Explicit CSP in `tauri.conf.json` (ADR-0001).
- [x] CI: `.github/workflows/validate.yml` (PR/push) and `audit.yml` (weekly pnpm audit + cargo audit).
- [x] PR template and CONTRIBUTING.md.
- [x] 4 retroactive ADRs: CSP, Zustand flat stores, SQLite local, module boundaries.

### Conscious deferrals

- ~~E2E tests with Playwright~~ — ✅ done (ADR-0009): `e2e/` suite over the frontend with faked transport.
- Native E2E with `tauri-driver` (covers real IPC→SQLite; when the DB path causes regressions or there is public distribution).
- `tauri-plugin-log` (when distributed beyond personal use).
- `manualChunks` in Vite (if the gzip bundle exceeds 200 KB).
- Self-host the "Press Start 2P" font to close `font-src` to `'self'`.
- `SessionRecorder` port to decouple timer ⇄ history (only if the dependency grows).
- Split of `SoundSection.tsx` (when a new sub-feature is added).
- Refactor `App.tsx` to a router-map (when a 3rd/4th view is added).

---

## v0.6 — Game-mode shell and data layer

- [x] Game-mode webview (kiosk guards: anti context-menu / devtools / drag — ADR-0008).
- [x] Versioned SQLite migrations via `PRAGMA user_version` (ADR-0006).
- [x] Data-layer boundary: `repository` wraps the transport and maps wire ⇄ domain (ADR-0005).
- [x] Bugfix sweep: respect mute in timer SFX, prevent heart loss, wall-clock countdown.

---

## v0.7 — Plant sprites v2

- [x] Redesigned plant sprites on a unified 24×30 grid with a shared pot (`shared/PotSprite`); lotus on its own 28×20 pond scene.

---

## v0.8 — Seed packets and stage close-up

- [x] Per-species seed-packet sprites (shared pouch base + unique accent band and bloom emblem) for the future shop feature — not yet wired into the UI.
- [x] Stage close-up in the stages modal: clicking a stage card shows the stage title, plant name and the sprite front and center.

---

## Done, unreleased

- [x] English standardization: all code comments, documentation, CHANGELOG, PR template and the release-please changelog sections in English (the only Spanish left is the `es.ts` user locale and DB-facing species IDs).

---

## Roadmap

Forward-looking backlog, grouped by the product pillars in [vision.md](vision.md). Order
within a group is rough priority, not a committed schedule. The **core loop** (shop →
garden) is the headline gap: hearts are earned but cannot yet be spent, and seed-packet
sprites exist with no screen to live in.

### Focused study

- [ ] Study-method configuration (presets such as Pomodoro / custom cycles).
- [ ] Allow adding notes to finished sessions.
- [ ] Real-session verification / good-use motivation (discourage gaming the counter; see [ADR-0007](adr/0007-centralized-game-rules.md) — rules are client-side for now).
- [ ] Active-screen redesign.
- [ ] Finished-screen redesign.
- [ ] Title design improvement.

### Hearts economy & shop

- [ ] Shop: economy (buy / sell), locked and unlockable plants, and the selection experience for plants, pots, tools, upgrades and plots.
- [ ] Inventory management.

### Garden

- [ ] Garden view: plots, planting-zone types, per-plant growth, and care mechanics (watering, growth-acceleration tools, uprooting, bonuses, cleanup).
- [ ] More plant types: aquatic plants, vines, trees, fruits, vegetables.

### Collection & cosmetics

- [ ] Game catalog: browse plant, tool and garden designs with legends and descriptions — a cosmetic, collectible section.

### Cozy offline experience & QOL

- [ ] Desktop notifications when a session ends.
- [ ] Real sounds (replace placeholder SFX).
- [ ] Pinnable compact mode (small always-on-top timer window).
- [ ] Animations: timer, plant growth, and other transitions.
- [ ] First-run onboarding/tutorial, replayable from settings.

### History & metrics

- [ ] History detail view: per-session detail with saved notes, plus study/usage metrics.

### Project & polish

- [x] Usage license and copyright — CC BY-NC-ND 4.0 (`LICENSE`), per-file SPDX headers, README section and in-app Settings credits. Maintenance & future considerations in [docs/playbook.md §12](playbook.md).
- [ ] Toast handling: error propagation/duplication and animation timing.
- [ ] App logo.

---

## Further future (post-v1, see vision non-goals)

- [ ] User accounts / management.
- [ ] Multiplayer (open question).
- [ ] Responsive / mobile (open question).

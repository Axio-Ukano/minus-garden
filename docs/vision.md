# Minu's Garden — Vision

## Description

**Minu's Garden** is an offline desktop app designed to accompany Minu's study sessions.
It pairs a focused study timer with a hearts economy and a virtual garden that grows as
you study. It is a cozy, game-like companion — not a productivity dashboard.

## Core loop

Study → earn hearts → spend them in the shop → plant and grow a garden → collect plants
and cosmetics. The garden is a visual record of accumulated effort, and light care
mechanics make breaks pleasant rather than another task.

## Product pillars

These are the directions the product grows in. Each roadmap item in
[requirements.md](requirements.md) belongs to one of them.

1. **Focused study** — a timer that supports real study habits: study-method presets,
   per-session subjects and notes, and honesty/motivation mechanics that reward genuine
   use over gaming the counter.
2. **Hearts economy** — hearts are earned by studying and spent in a shop (plants, pots,
   tools, upgrades, plots). Earning and spending must stay balanced and legible.
3. **Garden** — plots and planting zones, plant types with distinct growth, and care
   mechanics (watering, growth boosts, uprooting, cleanup, bonuses).
4. **Collection and cosmetics** — a catalog of plants, tools and garden pieces with
   legends and descriptions; variety (aquatic plants, vines, trees, fruits, vegetables)
   as collectible content.
5. **Cozy offline experience** — desktop-first, fully offline, game-like feel (kiosk
   mode, real sounds, animations, a pinnable compact mode, first-run onboarding).

## Tech stack

| Layer          | Technology            |
| -------------- | --------------------- |
| UI             | React 19 + TypeScript |
| Styles         | Vanilla CSS           |
| Desktop shell  | Tauri 2               |
| Native backend | Rust                  |
| Database       | SQLite (via rusqlite) |
| State          | Zustand 5             |

## Platform

- **Target:** Desktop (Windows and macOS)
- **Mode:** Offline-first — no internet connection required at runtime
- **Distribution:** Local installable binary

## Non-goals for v1

The following are explicitly out of scope for v1 and tracked under "Further future" in
[requirements.md](requirements.md):

- No login or user accounts
- No cloud sync
- No payments or real-money monetization
- No mobile or responsive layout
- No multiplayer

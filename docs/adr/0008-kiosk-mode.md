# ADR-0008: Kiosk mode — the app is a game, not a web page

- **Status:** Accepted
- **Date:** 2026-06-09
- **Deciders:** @author

## Context

Minu's Garden runs inside a Tauri webview. By default the webview leaks browser affordances that break the game illusion: context menu on right-click ("Inspect"), devtools shortcuts (F12, Ctrl+Shift+I/J/C), "view source" (Ctrl+U), image dragging, and text selection anywhere. The user explicitly requested that it behave like a game despite its web engine.

## Decision

Add `src/lib/kiosk.ts` with `initKiosk(document)`, installed once in `main.tsx`, which:

- blocks `contextmenu` (right-click),
- blocks devtools / view-source shortcuts via a pure predicate `isBlockedKey` (F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U),
- blocks `dragstart` (image dragging).

Text selection is suppressed via CSS in `global.css` (`user-select: none` on `html/body` and `img`) and re-enabled only on `input`, `textarea`, and `[contenteditable]` to avoid breaking text input. `isBlockedKey` is kept as a pure function so it can be tested in isolation.

## Consequences

### Good

- The app feels like a game: no browser menu, no casual inspection, no accidental selection or dragging.
- Key-blocking logic is testable in isolation; `initKiosk` returns a teardown function for tests.

### Bad

- This is not a real security barrier: a determined user can still inspect (Tauri production builds ship without devtools; these guards are mainly relevant for `tauri dev`). It is UX, not hardening.
- During development, opening devtools inside the webview requires remembering that shortcuts are intercepted (they remain available from outside the webview / OS menu).

### Neutral

- Selection suppression is done via CSS; any new control that needs selection must opt back in (as inputs already do).

## Considered Alternatives

### Disable devtools only in Rust/Tauri

Production already ships without devtools by default, so this does not cover the context menu or dev mode. Insufficient on its own; the JS guards are complementary.

### Do nothing (leave browser affordances in place)

Breaks the game experience the product aims for. Discarded per explicit requirement.

## Notes / References

- Implementation: `src/lib/kiosk.ts`, CSS rules in `src/styles/global.css`, wiring in `src/main.tsx`.

# ADR-0002: Zustand with flat stores per feature

- **Status:** Accepted
- **Date:** 2026-04-27
- **Deciders:** @author

## Context

The app needs shared state across views (running timer, saved sessions, audio settings, subjects list, total hearts) without the complexity of Redux. Each feature lives in its own `src/modules/<name>/` and must expose its state in an encapsulated way.

## Decision

One Zustand store per feature, declared in `src/modules/<name>/<name>Store.ts` and re-exported by the barrel `src/modules/<name>/index.ts`. No combined reducers, no complex selectors, no additional middleware except `persist` when a feature requires it (e.g. settings).

Current stores:

- `timerStore` — timer state + idle/running/paused/finished transitions + hearts calculation on `finish()`.
- `historyStore` — sessions, total hearts, hydration from Tauri.
- `audioStore` — active music/ambient + playlist states.
- `settingsStore` — theme, language, volumes, active section (persisted).
- `subjectStore` — user's study subjects.
- `lib/toast/toastStore` — ephemeral notifications.

Views read with `useXxxStore(state => state.foo)` and mutate with `useXxxStore.getState().bar()` when invoked outside React (services, other stores).

## Consequences

### Good

- Zero boilerplate compared to Redux.
- Each feature owns its contract; the barrel defines the public API.
- Trivial unit tests (`useXxxStore.setState({...})` and `useXxxStore.getState().method()`).
- No `Provider` wrapping needed for tests or for `App.tsx`.

### Bad

- No single state tree: debugging cross-store interactions requires knowing all stores involved.
- Coupling becomes implicit: timer calls history and audio directly. Documented and tested, but not isolated by interfaces.

### Neutral

- A future DevTools or time-travel setup would require adding the `devtools` middleware per store.

## Considered Alternatives

### Redux Toolkit

More structure, slices, DevTools out-of-the-box. Discarded: overkill for a small offline app with fewer than 10 stores and no need for advanced tooling.

### React Context + useReducer

Sufficient for small pieces, but re-renders and plumbing grow quickly with 6+ unrelated stores. Zustand avoids provider hell.

### Jotai / Recoil (atomic)

Attractive ergonomics but the app does not have that kind of fragmented state; stores are cohesive per feature.

## Notes

- Any new feature with shared state must follow the same pattern: `<feature>Store.ts` file + re-export in barrel.
- If a store grows beyond 250 lines in the future, evaluate splitting by sub-aspects before introducing more sophisticated middleware.

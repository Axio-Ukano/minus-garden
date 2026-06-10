# ADR-0005: Repository layer as the single data boundary

- **Status:** Accepted
- **Date:** 2026-06-09
- **Deciders:** @author

## Context

Until now each feature store (`historyStore`, `subjectStore`) called `tauriInvoke("<command>", …)` directly. This spreads knowledge of the transport throughout the entire app: Tauri command names, snake_case wire shapes and the mapping to domain camelCase. The project will grow across devices (mobile via Tauri) and, eventually, device-to-device synchronization — which will require a remote backend. With the current coupling, that day would mean rewriting all stores.

`src/lib/tauri.ts` already centralizes the _transport_ (invoke + toast + typed error), but not the _data contract_.

## Decision

Introduce `src/lib/data/` as the single boundary between feature modules and persistence:

- `src/lib/data/types.ts` — domain types (`Session`, `Subject`, `UserState`).
- `src/lib/data/index.ts` — a `repository` object with typed methods (`repository.sessions.list()`, `repository.userState.setHearts()`, etc.) that wrap `tauriInvoke` and handle the wire ⇄ domain mapping.

Boundary rule (to be enforced with ESLint when appropriate): no store or component imports `@tauri-apps/api` or calls `tauriInvoke` directly; everything goes through `repository`. Stores are left as UI state orchestrators, with no knowledge of the transport.

## Consequences

### Good

- Swapping SQLite-over-IPC for an HTTP/sync API touches **one single file** (`src/lib/data/index.ts`), not the stores.
- Caching, optimistic writes, or offline queues are added in a single place.
- The snake_case ⇄ camelCase mapping no longer leaks into the UI.
- Domain types no longer live inside a store (avoids circular dependencies between modules).

### Bad

- One additional indirection layer between store and `tauriInvoke`.
- The `Session`/`Subject` types are re-exported from stores for compatibility; it must be remembered that their canonical home is `src/lib/data/types.ts`.

### Neutral

- Store tests continue to mock `@/lib/tauri` (the repo is transparent); `repository.test.ts` was added to cover the mapping.

## Considered Alternatives

### Continue calling `tauriInvoke` from each store

Zero indirection, but replicates the contract in every feature and makes the jump to the network expensive. Discarded: this is exactly the coupling that the anticipated growth will penalize.

### One repository per module inside each feature

More "DDD", but scatters knowledge of the transport again and complicates the swap to HTTP. Discarded as over-engineering for the current size.

## Notes / References

- Related to ADR-0003 (local SQLite) and ADR-0004 (module boundaries).
- Document the layer in `docs/architecture.md`.

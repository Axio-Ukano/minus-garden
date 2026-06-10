# ADR-0007: Game rules in a single source of truth (client side, for now)

- **Status:** Accepted
- **Date:** 2026-06-09
- **Deciders:** @author

## Context

The game economy rules (hearts awarded per session, final plant stage) determine progression. The hearts formula `Math.floor(durationMinutes / 5)` was **duplicated** in `timerStore.finish()` and in `TimerFinishedView.tsx`: two copies of the same number that could diverge and show the user a different value from what gets persisted. `calculateFinalStage` already lived centralized in `plantService`.

The question also arises of whether these rules should be moved to the Rust process as an "anti-cheat source of truth". Today the app is **local-first, single-user, and serverless**: the user already has full access to their own `.db`, so there is no cheat surface to defend. Moving the rules to Rust now would couple plant render data (per-species thresholds, tied to i18n keys and TSX renderers) across the FFI with no current benefit — and would contradict the decision not to introduce a backend before it is needed.

## Decision

Consolidate session-end rules in `plantService` as the single source of truth on the client:

- Add `calculateHeartsEarned(durationMinutes)` and `MINUTES_PER_HEART` alongside `calculateFinalStage`.
- `timerStore` and `TimerFinishedView` import that function; the duplicated inline formula is removed.

The rules are **not** ported to Rust at this time. It is documented that this layer is the _client authority_ and is ready to be mirrored on the server on the day a sync backend exists (see ADR-0005 for the data boundary that will enable that transition).

## Consequences

### Good

- A single definition of the hearts economy; it is impossible for the UI and persistence to diverge.
- Single point to port/mirror when there is a server authority.
- No premature client ⇄ Rust coupling and no FFI cost without benefit.

### Bad

- Still client logic: in a future multiplayer/competitive scenario it would NOT be reliable as an authority. Consciously accepted while there is no server.

### Neutral

- `calculateHeartsEarned` lives in the `plants` module for consistency with `calculateFinalStage` (both are session-end rules), even though hearts are not strictly "plant" concerns.

## Considered Alternatives

### Port the rules to Rust now

Would give server authority… against a non-existent server. Couples plant data to the FFI without benefit and contradicts "no backend before it is needed". Deferred until remote sync is introduced.

### A new dedicated `game-rules` module

Semantically cleaner, but creating a module for two functions is over-engineering today. To be reconsidered if the economy grows (levels, streaks, multipliers).

## Notes / References

- Trigger for reopening this decision: introduction of a remote backend or competitive modes. At that point, move the authoritative layer to Rust/server and leave the client as predictive.

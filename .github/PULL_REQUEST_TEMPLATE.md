# Summary

<!-- What changes and why (1-3 lines). -->

## Type of change

<!-- One of: feat | fix | refactor | chore | build | ci | docs | test -->

## Validation

<!-- These always apply. Every box must be checked before requesting review. -->

- [ ] `pnpm validate` passes (typecheck + lint + format:check).
- [ ] `pnpm circular` reports no new cycles.
- [ ] `pnpm test:coverage` meets the configured threshold (60%).
- [ ] `pnpm build` is green.

## Scope checks

<!-- Keep ONLY the lines that apply to this PR and check them; DELETE the rest.
     A PR must never be opened with boxes that cannot be checked. -->

- [ ] Touches UI: manual smoke test done (timer → save → history → hearts).
- [ ] Introduces an architectural decision: ADR added under `docs/adr/`.
- [ ] Touches dependencies: justified and placed in the correct bucket
      (`dependencies` vs `devDependencies`).

## Screenshots / video

<!-- Before/after capture or a short clip when UI is affected; otherwise delete
     this section. -->

## Notes for the reviewer

<!-- Areas that deserve specific attention, open questions, follow-ups. -->

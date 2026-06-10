// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlantGrowth } from "./usePlantGrowth";
import { SUNFLOWER_SPECIES } from "./plantService";

describe("usePlantGrowth", () => {
  it("returns calculateStage(elapsedMinutes) — converts seconds to minutes", () => {
    // 15 minutes = 900 seconds; sunflower stage 2 threshold=10 → stage 2.
    const { result } = renderHook(() => usePlantGrowth(900, SUNFLOWER_SPECIES));
    expect(result.current.currentStage).toBe(2);
  });

  it("memoizes for the same inputs", () => {
    const { result, rerender } = renderHook(
      ({ s, sp }: { s: number; sp: typeof SUNFLOWER_SPECIES }) => usePlantGrowth(s, sp),
      { initialProps: { s: 600, sp: SUNFLOWER_SPECIES } }
    );
    const first = result.current;
    rerender({ s: 600, sp: SUNFLOWER_SPECIES });
    expect(result.current).toBe(first);
  });

  it("recomputes when elapsedSeconds changes", () => {
    const { result, rerender } = renderHook(
      ({ s }: { s: number }) => usePlantGrowth(s, SUNFLOWER_SPECIES),
      { initialProps: { s: 0 } }
    );
    expect(result.current.currentStage).toBe(1);
    rerender({ s: 600 });
    expect(result.current.currentStage).toBe(2);
  });

  it("flags isMaxStage when elapsedSeconds is past the max threshold", () => {
    const { result } = renderHook(() => usePlantGrowth(99999 * 60, SUNFLOWER_SPECIES));
    expect(result.current.isMaxStage).toBe(true);
    expect(result.current.currentStage).toBe(SUNFLOWER_SPECIES.maxStages);
  });
});

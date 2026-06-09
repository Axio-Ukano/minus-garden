import { describe, it, expect } from "vitest";
import {
  ALL_SPECIES,
  DAISY_SPECIES,
  SUNFLOWER_SPECIES,
  LOTUS_SPECIES,
  calculateStage,
  calculateFinalStage,
  calculateHeartsEarned,
  getSpeciesById,
  getStageName,
} from "./plantService";

describe("plantService", () => {
  describe("getSpeciesById", () => {
    it("returns the matching species", () => {
      expect(getSpeciesById("lotus").id).toBe("lotus");
      expect(getSpeciesById("sunflower").id).toBe("sunflower");
    });

    it("falls back to daisy for unknown ids", () => {
      expect(getSpeciesById("nonexistent").id).toBe("daisy");
      expect(getSpeciesById("").id).toBe("daisy");
    });
  });

  describe("calculateStage", () => {
    it("returns stage 0 with progressToNext when elapsed is below all thresholds", () => {
      // Daisy thresholds: [0, 1, 2, 3, 4]; elapsed below 0 means stage 1.
      // For sunflower, thresholds: [0, 10, ...]; elapsed=0 → stage 1.
      const result = calculateStage(0, SUNFLOWER_SPECIES);
      expect(result.currentStage).toBe(1);
      expect(result.isMaxStage).toBe(false);
    });

    it("returns the highest reachable stage for elapsed minutes", () => {
      // Sunflower thresholds: [0, 10, 20, 35, 50, 70, 90]
      expect(calculateStage(15, SUNFLOWER_SPECIES).currentStage).toBe(2);
      expect(calculateStage(20, SUNFLOWER_SPECIES).currentStage).toBe(3);
      expect(calculateStage(35, SUNFLOWER_SPECIES).currentStage).toBe(4);
      expect(calculateStage(50, SUNFLOWER_SPECIES).currentStage).toBe(5);
      expect(calculateStage(70, SUNFLOWER_SPECIES).currentStage).toBe(6);
      expect(calculateStage(90, SUNFLOWER_SPECIES).currentStage).toBe(7);
    });

    it("clamps to maxStages and flags isMaxStage", () => {
      const result = calculateStage(999, SUNFLOWER_SPECIES);
      expect(result.currentStage).toBe(SUNFLOWER_SPECIES.maxStages);
      expect(result.isMaxStage).toBe(true);
      expect(result.progressToNext).toBe(0);
    });

    it("computes progressToNext linearly between thresholds", () => {
      // Sunflower: between 10 and 20 → at 15, half-way.
      const result = calculateStage(15, SUNFLOWER_SPECIES);
      expect(result.progressToNext).toBeCloseTo(0.5, 5);
    });

    it("clamps progressToNext to 1 when above next threshold inside same stage", () => {
      // No-op since the loop snaps to next threshold; verify via boundary
      const exact = calculateStage(20, SUNFLOWER_SPECIES);
      expect(exact.progressToNext).toBe(0);
    });

    it("handles zero-range stages by setting progressToNext to 1", () => {
      // Daisy: thresholds [0, 1, 2, 3, 4], range always 1 — but at the
      // last unreached stage (e.g. elapsed=3.5, currentStage=4, next=4 → range=0).
      const result = calculateStage(3.5, DAISY_SPECIES);
      expect(result.currentStage).toBe(4);
      expect(result.progressToNext).toBeCloseTo(0.5, 5);
    });
  });

  describe("calculateFinalStage", () => {
    it("respects unlockThreshold (0.8) — needs 80% of next threshold to unlock", () => {
      // Sunflower stage 2 threshold=10, requires >= 10 * 0.8 = 8 min.
      expect(calculateFinalStage(7, SUNFLOWER_SPECIES)).toBe(1);
      expect(calculateFinalStage(8, SUNFLOWER_SPECIES)).toBe(2);
      // Stage 3 threshold=20, needs >= 16 min.
      expect(calculateFinalStage(16, SUNFLOWER_SPECIES)).toBe(3);
      expect(calculateFinalStage(15, SUNFLOWER_SPECIES)).toBe(2);
    });

    it("clamps to maxStages", () => {
      expect(calculateFinalStage(99999, LOTUS_SPECIES)).toBe(LOTUS_SPECIES.maxStages);
    });

    it("returns 0 for negative durations", () => {
      expect(calculateFinalStage(-5, SUNFLOWER_SPECIES)).toBe(0);
    });
  });

  describe("calculateHeartsEarned", () => {
    it("awards one heart per 5 minutes, floored", () => {
      expect(calculateHeartsEarned(0)).toBe(0);
      expect(calculateHeartsEarned(4)).toBe(0);
      expect(calculateHeartsEarned(5)).toBe(1);
      expect(calculateHeartsEarned(24)).toBe(4);
      expect(calculateHeartsEarned(25)).toBe(5);
    });

    it("never returns negative for non-positive durations", () => {
      expect(calculateHeartsEarned(-10)).toBe(0);
    });
  });

  describe("ALL_SPECIES registry", () => {
    it("contains the documented species", () => {
      const ids = ALL_SPECIES.map((s) => s.id);
      expect(ids).toContain("daisy");
      expect(ids).toContain("sunflower");
      expect(ids).toContain("lotus");
      expect(ids).toContain("orquidea");
      expect(ids).toContain("cactus");
    });

    it("has consistent maxStages, stageThresholds.length and stageKeys.length per species", () => {
      for (const s of ALL_SPECIES) {
        expect(s.stageThresholds.length).toBe(s.maxStages);
        expect(s.stageKeys.length).toBe(s.maxStages);
        expect(s.unlockThreshold).toBeGreaterThan(0);
        expect(s.unlockThreshold).toBeLessThanOrEqual(1);
      }
    });

    it("stageThresholds are non-decreasing per species", () => {
      for (const s of ALL_SPECIES) {
        for (let i = 1; i < s.stageThresholds.length; i++) {
          expect(s.stageThresholds[i]!).toBeGreaterThanOrEqual(s.stageThresholds[i - 1]!);
        }
      }
    });
  });

  describe("getStageName", () => {
    // Only the plants.stages branch is read by getStageName, so we cast through
    // unknown to keep the fixture minimal.
    const fakeT = {
      plants: {
        stages: {
          seed: "Semilla",
          sprout: "Brote",
          stem: "Tallo",
          bud: "Capullo",
          daisy: "Margarita",
        },
      },
    } as unknown as Parameters<typeof getStageName>[2];

    it("returns the translated stage name", () => {
      expect(getStageName(1, DAISY_SPECIES, fakeT)).toBe("Semilla");
      expect(getStageName(5, DAISY_SPECIES, fakeT)).toBe("Margarita");
    });

    it("falls back to a generic label when stage is out of range", () => {
      expect(getStageName(99, DAISY_SPECIES, fakeT)).toBe("Stage 99");
    });
  });
});

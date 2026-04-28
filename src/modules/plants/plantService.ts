// ─── Plant Species Registry ──────────────────────────────────────────────────
// All plant-related configuration lives here. Adding a new plant means
// adding one entry to ALL_SPECIES and creating its stage renderer under plants/<species>/.

import type { Translations } from "../../i18n/en";

export type StageKey = keyof Translations["plants"]["stages"];

export interface PlantSpecies {
  id: string;
  maxStages: number;
  /** Minutes elapsed required to *enter* each stage (0-indexed, length === maxStages) */
  stageThresholds: number[];
  stageKeys: StageKey[];
  /** Fraction of a stage's threshold required to unlock it at session completion (e.g. 0.8 = 80%) */
  unlockThreshold: number;
}

export interface PlantGrowthState {
  currentStage: number;
  progressToNext: number;
  isMaxStage: boolean;
}

// ─── Daisy ───────────────────────────────────────────────────────────────────
export const DAISY_SPECIES: PlantSpecies = {
  id: "daisy",
  maxStages: 5,
  stageThresholds: [0, 1, 2, 3, 4], // Test mode: 1 minute per stage
  stageKeys: ["seed", "sprout", "stem", "bud", "daisy"],
  unlockThreshold: 0.8,
};

// ─── Sunflower ────────────────────────────────────────────────────────────────
export const SUNFLOWER_SPECIES: PlantSpecies = {
  id: "sunflower",
  maxStages: 7,
  stageThresholds: [0, 10, 20, 35, 50, 70, 90],
  stageKeys: ["seed", "sprout", "stem", "tall_stem", "bud", "partial_flower", "sunflower"],
  unlockThreshold: 0.8,
};

// ─── Gerbera ─────────────────────────────────────────────────────────────────
export const GERBERA_SPECIES: PlantSpecies = {
  id: "gerbera",
  maxStages: 5,
  stageThresholds: [0, 8, 16, 25, 35],
  stageKeys: ["seed", "sprout", "stem", "bud", "gerbera"],
  unlockThreshold: 0.8,
};

// ─── Lavender ─────────────────────────────────────────────────────────────────
export const LAVENDER_SPECIES: PlantSpecies = {
  id: "lavanda",
  maxStages: 5,
  stageThresholds: [0, 10, 20, 35, 50],
  stageKeys: ["seed", "sprout", "stem", "spike", "lavender"],
  unlockThreshold: 0.8,
};

// ─── Carnation ───────────────────────────────────────────────────────────────
export const CARNATION_SPECIES: PlantSpecies = {
  id: "clavel",
  maxStages: 6,
  stageThresholds: [0, 10, 20, 30, 45, 60],
  stageKeys: ["seed", "sprout", "stem", "bud", "partial_carnation", "carnation"],
  unlockThreshold: 0.8,
};

// ─── Iris ────────────────────────────────────────────────────────────────────
export const IRIS_SPECIES: PlantSpecies = {
  id: "lirio",
  maxStages: 6,
  stageThresholds: [0, 12, 25, 40, 55, 70],
  stageKeys: ["seed", "sprout", "stem", "bud", "partial_iris", "iris"],
  unlockThreshold: 0.8,
};

// ─── Peony ───────────────────────────────────────────────────────────────────
export const PEONY_SPECIES: PlantSpecies = {
  id: "peonia",
  maxStages: 7,
  stageThresholds: [0, 10, 20, 35, 50, 65, 80],
  stageKeys: ["seed", "sprout", "stem", "bud", "opening", "partial_flower", "peony"],
  unlockThreshold: 0.8,
};

// ─── Cactus ──────────────────────────────────────────────────────────────────
export const CACTUS_SPECIES: PlantSpecies = {
  id: "cactus",
  maxStages: 6,
  stageThresholds: [0, 15, 35, 55, 75, 90],
  stageKeys: ["seed", "sprout", "seedling", "young_cactus", "cactus", "blooming_cactus"],
  unlockThreshold: 0.75,
};

// ─── Orchid ──────────────────────────────────────────────────────────────────
export const ORCHID_SPECIES: PlantSpecies = {
  id: "orquidea",
  maxStages: 8,
  stageThresholds: [0, 10, 22, 36, 52, 70, 88, 110],
  stageKeys: ["seed", "sprout", "roots", "stem", "bud", "partial_orchid", "orchid", "full_orchid"],
  unlockThreshold: 0.8,
};

// ─── Lotus Flower ─────────────────────────────────────────────────────────────
export const LOTUS_SPECIES: PlantSpecies = {
  id: "lotus",
  maxStages: 9,
  stageThresholds: [0, 10, 25, 40, 55, 70, 85, 100, 120],
  stageKeys: [
    "seed",
    "sprout",
    "roots",
    "aquatic_stem",
    "bud",
    "opening",
    "partial_lotus",
    "lotus",
    "sacred_lotus",
  ],
  unlockThreshold: 0.8,
};

// ─── Registry (add future plants here) ───────────────────────────────────────
export const ALL_SPECIES: PlantSpecies[] = [
  DAISY_SPECIES,
  SUNFLOWER_SPECIES,
  GERBERA_SPECIES,
  LAVENDER_SPECIES,
  CARNATION_SPECIES,
  IRIS_SPECIES,
  PEONY_SPECIES,
  CACTUS_SPECIES,
  ORCHID_SPECIES,
  LOTUS_SPECIES,
];

export function getSpeciesById(id: string): PlantSpecies {
  return ALL_SPECIES.find((s) => s.id === id) ?? DAISY_SPECIES;
}

// ─── Growth calculation ───────────────────────────────────────────────────────
export function calculateStage(elapsedMinutes: number, species: PlantSpecies): PlantGrowthState {
  const { stageThresholds, maxStages } = species;
  let currentStage = 0;

  for (let i = stageThresholds.length - 1; i >= 0; i--) {
    const threshold = stageThresholds[i];
    if (threshold !== undefined && elapsedMinutes >= threshold) {
      currentStage = i + 1;
      break;
    }
  }

  currentStage = Math.min(currentStage, maxStages);
  const isMaxStage = currentStage >= maxStages;

  let progressToNext = 0;
  if (!isMaxStage) {
    const currentThreshold = stageThresholds[currentStage - 1] ?? 0;
    const nextThreshold = stageThresholds[currentStage] ?? currentThreshold;
    const range = nextThreshold - currentThreshold;
    progressToNext = range > 0 ? Math.min((elapsedMinutes - currentThreshold) / range, 1) : 1;
  }

  return { currentStage, progressToNext, isMaxStage };
}

// Applies unlockThreshold — only used at session completion, not during live timer.
// A session unlocks stage i if durationMinutes >= stageThresholds[i] * unlockThreshold.
export function calculateFinalStage(durationMinutes: number, species: PlantSpecies): number {
  const { stageThresholds, maxStages, unlockThreshold } = species;
  let currentStage = 0;

  for (let i = stageThresholds.length - 1; i >= 0; i--) {
    const threshold = stageThresholds[i];
    if (threshold !== undefined && durationMinutes >= threshold * unlockThreshold) {
      currentStage = i + 1;
      break;
    }
  }

  return Math.min(currentStage, maxStages);
}

export function getStageName(stage: number, species: PlantSpecies, t: Translations): string {
  const key = species.stageKeys[stage - 1];
  return key ? t.plants.stages[key] : `Stage ${stage}`;
}

type PlantNameKey = keyof Omit<Translations["plants"], "stages">;

export function getPlantName(species: PlantSpecies, t: Translations): string {
  return t.plants[species.id as PlantNameKey] ?? species.id;
}

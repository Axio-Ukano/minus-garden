// ─── Plant Species Registry ──────────────────────────────────────────────────
// All plant-related configuration lives here. Adding a new plant means
// adding one entry to ALL_SPECIES and creating its stage renderer under plants/<species>/.

export interface PlantSpecies {
  id: string;
  name: string;
  maxStages: number;
  /** Minutes elapsed required to *enter* each stage (0-indexed, length === maxStages) */
  stageThresholds: number[];
  stageNames: string[];
}

export interface PlantGrowthState {
  currentStage: number;
  progressToNext: number;
  isMaxStage: boolean;
}

// ─── Daisy ───────────────────────────────────────────────────────────────────
export const DAISY_SPECIES: PlantSpecies = {
  id: "daisy",
  name: "Margarita",
  maxStages: 5,
  stageThresholds: [0, 1, 2, 3, 4], // Test mode: 1 minute per stage
  stageNames: ["Semilla", "Brote", "Tallo", "Botón", "Margarita"],
};

// ─── Sunflower ───────────────────────────────────────────────────────────────
export const SUNFLOWER_SPECIES: PlantSpecies = {
  id: "sunflower",
  name: "Girasol",
  maxStages: 7,
  stageThresholds: [0, 1, 2, 3, 4, 5, 6], // Test mode: 1 minute per stage
  stageNames: ["Semilla", "Brote", "Tallo", "Tallo Alto", "Capullo", "Flor Parcial", "Girasol"],
};

// ─── Registry (add future plants here) ───────────────────────────────────────
export const ALL_SPECIES: PlantSpecies[] = [DAISY_SPECIES, SUNFLOWER_SPECIES];

export function getSpeciesById(id: string): PlantSpecies {
  return ALL_SPECIES.find((s) => s.id === id) ?? DAISY_SPECIES;
}

// ─── Growth calculation ───────────────────────────────────────────────────────
export function calculateStage(elapsedMinutes: number, species: PlantSpecies): PlantGrowthState {
  const { stageThresholds, maxStages } = species;
  let currentStage = 0;

  for (let i = stageThresholds.length - 1; i >= 0; i--) {
    if (elapsedMinutes >= stageThresholds[i]) {
      currentStage = i + 1;
      break;
    }
  }

  currentStage = Math.min(currentStage, maxStages);
  const isMaxStage = currentStage >= maxStages;

  let progressToNext = 0;
  if (!isMaxStage) {
    const currentThreshold = stageThresholds[currentStage - 1];
    const nextThreshold = stageThresholds[currentStage];
    const range = nextThreshold - currentThreshold;
    progressToNext = range > 0 ? Math.min((elapsedMinutes - currentThreshold) / range, 1) : 1;
  }

  return { currentStage, progressToNext, isMaxStage };
}

export function calculateFinalStage(durationMinutes: number, species: PlantSpecies): number {
  return calculateStage(durationMinutes, species).currentStage;
}

export function getStageName(stage: number, species: PlantSpecies): string {
  return species.stageNames[stage - 1] ?? `Etapa ${stage}`;
}

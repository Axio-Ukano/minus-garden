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
  /** Fraction of a stage's threshold required to unlock it at session completion (e.g. 0.8 = 80%) */
  unlockThreshold: number;
}

export interface PlantGrowthState {
  currentStage: number;
  progressToNext: number;
  isMaxStage: boolean;
}

// ─── Margarita ───────────────────────────────────────────────────────────────
export const DAISY_SPECIES: PlantSpecies = {
  id: "daisy",
  name: "Margarita",
  maxStages: 5,
  stageThresholds: [0, 1, 2, 3, 4], // Test mode: 1 minute per stage
  stageNames: ["Semilla", "Brote", "Tallo", "Botón", "Margarita"],
  unlockThreshold: 0.8,
};

// ─── Girasol ─────────────────────────────────────────────────────────────────
export const SUNFLOWER_SPECIES: PlantSpecies = {
  id: "sunflower",
  name: "Girasol",
  maxStages: 7,
  stageThresholds: [0, 10, 20, 35, 50, 70, 90],
  stageNames: ["Semilla", "Brote", "Tallo", "Tallo Alto", "Capullo", "Flor Parcial", "Girasol"],
  unlockThreshold: 0.8,
};

// ─── Gerbera ─────────────────────────────────────────────────────────────────
export const GERBERA_SPECIES: PlantSpecies = {
  id: "gerbera",
  name: "Gerbera",
  maxStages: 5,
  stageThresholds: [0, 8, 16, 25, 35],
  stageNames: ["Semilla", "Brote", "Tallo", "Botón", "Gerbera"],
  unlockThreshold: 0.8,
};

// ─── Lavanda ─────────────────────────────────────────────────────────────────
export const LAVANDA_SPECIES: PlantSpecies = {
  id: "lavanda",
  name: "Lavanda",
  maxStages: 5,
  stageThresholds: [0, 10, 20, 35, 50],
  stageNames: ["Semilla", "Brote", "Tallo", "Espiga", "Lavanda"],
  unlockThreshold: 0.8,
};

// ─── Clavel ──────────────────────────────────────────────────────────────────
export const CLAVEL_SPECIES: PlantSpecies = {
  id: "clavel",
  name: "Clavel",
  maxStages: 6,
  stageThresholds: [0, 10, 20, 30, 45, 60],
  stageNames: ["Semilla", "Brote", "Tallo", "Botón", "Clavel Parcial", "Clavel"],
  unlockThreshold: 0.8,
};

// ─── Lirio ───────────────────────────────────────────────────────────────────
export const LIRIO_SPECIES: PlantSpecies = {
  id: "lirio",
  name: "Lirio",
  maxStages: 6,
  stageThresholds: [0, 12, 25, 40, 55, 70],
  stageNames: ["Semilla", "Brote", "Tallo", "Botón", "Flor Parcial", "Lirio"],
  unlockThreshold: 0.8,
};

// ─── Peonía ──────────────────────────────────────────────────────────────────
export const PEONIA_SPECIES: PlantSpecies = {
  id: "peonia",
  name: "Peonía",
  maxStages: 7,
  stageThresholds: [0, 10, 20, 35, 50, 65, 80],
  stageNames: ["Semilla", "Brote", "Tallo", "Botón", "Apertura", "Flor Parcial", "Peonía"],
  unlockThreshold: 0.8,
};

// ─── Cactus ──────────────────────────────────────────────────────────────────
export const CACTUS_SPECIES: PlantSpecies = {
  id: "cactus",
  name: "Cactus",
  maxStages: 6,
  stageThresholds: [0, 15, 35, 55, 75, 90],
  stageNames: ["Semilla", "Brote", "Plántula", "Cactus Joven", "Cactus", "Cactus Florido"],
  unlockThreshold: 0.75,
};

// ─── Orquídea ─────────────────────────────────────────────────────────────────
export const ORQUIDEA_SPECIES: PlantSpecies = {
  id: "orquidea",
  name: "Orquídea",
  maxStages: 8,
  stageThresholds: [0, 10, 22, 36, 52, 70, 88, 110],
  stageNames: [
    "Semilla",
    "Brote",
    "Raíces",
    "Tallo",
    "Botón",
    "Flor Parcial",
    "Orquídea",
    "Orquídea Plena",
  ],
  unlockThreshold: 0.8,
};

// ─── Flor de Loto ─────────────────────────────────────────────────────────────
export const LOTUS_SPECIES: PlantSpecies = {
  id: "lotus",
  name: "Flor de Loto",
  maxStages: 9,
  stageThresholds: [0, 10, 25, 40, 55, 70, 85, 100, 120],
  stageNames: [
    "Semilla",
    "Brote",
    "Raíces",
    "Tallo Acuático",
    "Botón",
    "Apertura",
    "Loto Parcial",
    "Loto",
    "Loto Sagrado",
  ],
  unlockThreshold: 0.8,
};

// ─── Registry (add future plants here) ───────────────────────────────────────
export const ALL_SPECIES: PlantSpecies[] = [
  DAISY_SPECIES,
  SUNFLOWER_SPECIES,
  GERBERA_SPECIES,
  LAVANDA_SPECIES,
  CLAVEL_SPECIES,
  LIRIO_SPECIES,
  PEONIA_SPECIES,
  CACTUS_SPECIES,
  ORQUIDEA_SPECIES,
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

// Applies unlockThreshold — only used at session completion, not during live timer.
// A session unlocks stage i if durationMinutes >= stageThresholds[i] * unlockThreshold.
export function calculateFinalStage(durationMinutes: number, species: PlantSpecies): number {
  const { stageThresholds, maxStages, unlockThreshold } = species;
  let currentStage = 0;

  for (let i = stageThresholds.length - 1; i >= 0; i--) {
    if (durationMinutes >= stageThresholds[i] * unlockThreshold) {
      currentStage = i + 1;
      break;
    }
  }

  return Math.min(currentStage, maxStages);
}

export function getStageName(stage: number, species: PlantSpecies): string {
  return species.stageNames[stage - 1] ?? `Etapa ${stage}`;
}

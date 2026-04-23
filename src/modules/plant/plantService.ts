export interface PlantSpecies {
  id: string
  name: string
  maxStages: number
  stageThresholds: number[]
}

export interface PlantGrowthState {
  currentStage: number
  progressToNext: number
  isMaxStage: boolean
}

export const DAISY_SPECIES: PlantSpecies = {
  id: 'daisy',
  name: 'Margarita',
  maxStages: 5,
  stageThresholds: [0, 24, 48, 72, 96],
}

const DAISY_STAGE_NAMES = ['Semilla', 'Brote', 'Tallo', 'Botón', 'Margarita']

export function calculateStage(
  elapsedMinutes: number,
  species: PlantSpecies,
): PlantGrowthState {
  const { stageThresholds, maxStages } = species
  let currentStage = 0

  for (let i = stageThresholds.length - 1; i >= 0; i--) {
    if (elapsedMinutes >= stageThresholds[i]) {
      currentStage = i + 1
      break
    }
  }

  // Clamp to maxStages (1-indexed)
  currentStage = Math.min(currentStage, maxStages)

  const isMaxStage = currentStage >= maxStages

  let progressToNext = 0
  if (!isMaxStage) {
    const currentThreshold = stageThresholds[currentStage - 1]
    const nextThreshold = stageThresholds[currentStage]
    const range = nextThreshold - currentThreshold
    progressToNext = range > 0
      ? Math.min((elapsedMinutes - currentThreshold) / range, 1)
      : 1
  }

  return { currentStage, progressToNext, isMaxStage }
}

export function calculateFinalStage(
  durationMinutes: number,
  species: PlantSpecies,
): number {
  return calculateStage(durationMinutes, species).currentStage
}

export function getStageName(stage: number, speciesId: string): string {
  if (speciesId === 'daisy') {
    return DAISY_STAGE_NAMES[stage - 1] ?? `Etapa ${stage}`
  }
  return `Etapa ${stage}`
}

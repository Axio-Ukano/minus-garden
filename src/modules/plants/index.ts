// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

export { PlantDisplay } from "./PlantDisplay";
export { usePlantGrowth } from "./usePlantGrowth";
export {
  ALL_SPECIES,
  getSpeciesById,
  getStageName,
  getPlantName,
  calculateStage,
  calculateFinalStage,
  calculateHeartsEarned,
} from "./plantService";
export type { PlantSpecies, PlantGrowthState, StageKey } from "./plantService";
export { PlantStagesModal } from "./PlantStagesModal";
export { SeedPacketDisplay } from "./seedPackets/SeedPacketDisplay";
export { SEED_PACKET_SPRITES } from "./seedPackets/SeedPacketSprites";

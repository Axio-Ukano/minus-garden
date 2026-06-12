// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
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
  MINUTES_PER_HEART,
} from "./plantService";
export type { PlantSpecies, PlantGrowthState, StageKey } from "./plantService";
export { SEED_CATALOG, getSeedListing } from "./seedCatalog";
export type { SeedListing, SeedTier } from "./seedCatalog";
export { PlantStagesModal } from "./PlantStagesModal";
export { SeedPacketDisplay } from "./seedPackets/SeedPacketDisplay";
export { SEED_PACKET_SPRITES } from "./seedPackets/SeedPacketSprites";

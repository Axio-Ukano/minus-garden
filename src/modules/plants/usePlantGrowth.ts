// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useMemo } from "react";
import { calculateStage } from "./plantService";
import type { PlantSpecies, PlantGrowthState } from "./plantService";

export function usePlantGrowth(elapsedSeconds: number, species: PlantSpecies): PlantGrowthState {
  return useMemo(() => {
    const elapsedMinutes = elapsedSeconds / 60;
    return calculateStage(elapsedMinutes, species);
  }, [elapsedSeconds, species]);
}

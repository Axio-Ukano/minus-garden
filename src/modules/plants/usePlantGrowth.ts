import { useMemo } from "react";
import { calculateStage } from "./plantService";
import type { PlantSpecies, PlantGrowthState } from "./plantService";

export function usePlantGrowth(elapsedSeconds: number, species: PlantSpecies): PlantGrowthState {
  return useMemo(() => {
    const elapsedMinutes = elapsedSeconds / 60;
    return calculateStage(elapsedMinutes, species);
  }, [elapsedSeconds, species]);
}

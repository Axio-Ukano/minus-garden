import {
  DaisyStage1,
  DaisyStage2,
  DaisyStage3,
  DaisyStage4,
  DaisyStage5,
} from "./daisy/DaisyStages";
import {
  SunflowerStage1,
  SunflowerStage2,
  SunflowerStage3,
  SunflowerStage4,
  SunflowerStage5,
  SunflowerStage6,
  SunflowerStage7,
} from "./sunflower/SunflowerStages";

const DAISY_STAGES = [DaisyStage1, DaisyStage2, DaisyStage3, DaisyStage4, DaisyStage5];
const SUNFLOWER_STAGES = [
  SunflowerStage1,
  SunflowerStage2,
  SunflowerStage3,
  SunflowerStage4,
  SunflowerStage5,
  SunflowerStage6,
  SunflowerStage7,
];

export type PlantSize = "sm" | "md" | "lg" | "xl";

const SIZE_PX = { sm: 32, md: 64, lg: 80, xl: 120 } as const;

// ── Species → Stages map ─────────────────────────────────────────────────────
const SPECIES_STAGES: Record<string, Array<() => React.JSX.Element>> = {
  daisy: DAISY_STAGES,
  sunflower: SUNFLOWER_STAGES,
};

interface PlantDisplayProps {
  stage: number;
  speciesId?: string;
  size?: PlantSize;
}

export function PlantDisplay({ stage, speciesId = "daisy", size = "md" }: PlantDisplayProps) {
  const stages = SPECIES_STAGES[speciesId] ?? DAISY_STAGES;
  const px_size = SIZE_PX[size];
  const clampedStage = Math.max(1, Math.min(stage, stages.length));
  const StageComponent = stages[clampedStage - 1];

  return (
    <svg
      width={px_size}
      height={px_size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", display: "block" }}
    >
      <StageComponent />
    </svg>
  );
}

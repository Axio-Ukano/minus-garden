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
import {
  GerberaStage1,
  GerberaStage2,
  GerberaStage3,
  GerberaStage4,
  GerberaStage5,
} from "./gerbera/GerberaStages";
import {
  LavandaStage1,
  LavandaStage2,
  LavandaStage3,
  LavandaStage4,
  LavandaStage5,
} from "./lavanda/LavandaStages";
import {
  ClavelStage1,
  ClavelStage2,
  ClavelStage3,
  ClavelStage4,
  ClavelStage5,
  ClavelStage6,
} from "./clavel/ClavelStages";
import {
  LirioStage1,
  LirioStage2,
  LirioStage3,
  LirioStage4,
  LirioStage5,
  LirioStage6,
} from "./lirio/LirioStages";
import {
  PeoniaStage1,
  PeoniaStage2,
  PeoniaStage3,
  PeoniaStage4,
  PeoniaStage5,
  PeoniaStage6,
  PeoniaStage7,
} from "./peonia/PeoniaStages";
import {
  CactusStage1,
  CactusStage2,
  CactusStage3,
  CactusStage4,
  CactusStage5,
  CactusStage6,
} from "./cactus/CactusStages";
import {
  OrquideaStage1,
  OrquideaStage2,
  OrquideaStage3,
  OrquideaStage4,
  OrquideaStage5,
  OrquideaStage6,
  OrquideaStage7,
  OrquideaStage8,
} from "./orquidea/OrquideaStages";
import {
  LotusStage1,
  LotusStage2,
  LotusStage3,
  LotusStage4,
  LotusStage5,
  LotusStage6,
  LotusStage7,
  LotusStage8,
  LotusStage9,
} from "./lotus/LotusStages";

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
  gerbera: [GerberaStage1, GerberaStage2, GerberaStage3, GerberaStage4, GerberaStage5],
  lavanda: [LavandaStage1, LavandaStage2, LavandaStage3, LavandaStage4, LavandaStage5],
  clavel: [ClavelStage1, ClavelStage2, ClavelStage3, ClavelStage4, ClavelStage5, ClavelStage6],
  lirio: [LirioStage1, LirioStage2, LirioStage3, LirioStage4, LirioStage5, LirioStage6],
  peonia: [
    PeoniaStage1,
    PeoniaStage2,
    PeoniaStage3,
    PeoniaStage4,
    PeoniaStage5,
    PeoniaStage6,
    PeoniaStage7,
  ],
  cactus: [CactusStage1, CactusStage2, CactusStage3, CactusStage4, CactusStage5, CactusStage6],
  orquidea: [
    OrquideaStage1,
    OrquideaStage2,
    OrquideaStage3,
    OrquideaStage4,
    OrquideaStage5,
    OrquideaStage6,
    OrquideaStage7,
    OrquideaStage8,
  ],
  lotus: [
    LotusStage1,
    LotusStage2,
    LotusStage3,
    LotusStage4,
    LotusStage5,
    LotusStage6,
    LotusStage7,
    LotusStage8,
    LotusStage9,
  ],
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

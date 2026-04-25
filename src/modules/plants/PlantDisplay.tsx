import type { JSX } from "react";
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
  LavenderStage1,
  LavenderStage2,
  LavenderStage3,
  LavenderStage4,
  LavenderStage5,
} from "./lavender/LavenderStages";
import {
  CarnationStage1,
  CarnationStage2,
  CarnationStage3,
  CarnationStage4,
  CarnationStage5,
  CarnationStage6,
} from "./carnation/CarnationStages";
import {
  IrisStage1,
  IrisStage2,
  IrisStage3,
  IrisStage4,
  IrisStage5,
  IrisStage6,
} from "./iris/IrisStages";
import {
  PeonyStage1,
  PeonyStage2,
  PeonyStage3,
  PeonyStage4,
  PeonyStage5,
  PeonyStage6,
  PeonyStage7,
} from "./peony/PeonyStages";
import {
  CactusStage1,
  CactusStage2,
  CactusStage3,
  CactusStage4,
  CactusStage5,
  CactusStage6,
} from "./cactus/CactusStages";
import {
  OrchidStage1,
  OrchidStage2,
  OrchidStage3,
  OrchidStage4,
  OrchidStage5,
  OrchidStage6,
  OrchidStage7,
  OrchidStage8,
} from "./orchid/OrchidStages";
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

// Natural viewBox dimensions per species — drives aspect-ratio-correct rendering
const SPECIES_META: Record<string, { vw: number; vh: number }> = {
  daisy:     { vw: 16, vh: 22 },
  sunflower: { vw: 20, vh: 28 },
  gerbera:   { vw: 18, vh: 22 },
  lavanda:   { vw: 14, vh: 26 },
  clavel:    { vw: 18, vh: 24 },
  lirio:     { vw: 16, vh: 26 },
  peonia:    { vw: 22, vh: 22 },
  cactus:    { vw: 18, vh: 26 },
  orquidea:  { vw: 20, vh: 28 },
  lotus:     { vw: 24, vh: 18 },
};

// ── Species → Stages map — IDs match DB values, do not change ────────────────
const SPECIES_STAGES: Record<string, Array<() => JSX.Element>> = {
  daisy: DAISY_STAGES,
  sunflower: SUNFLOWER_STAGES,
  gerbera: [GerberaStage1, GerberaStage2, GerberaStage3, GerberaStage4, GerberaStage5],
  lavanda: [LavenderStage1, LavenderStage2, LavenderStage3, LavenderStage4, LavenderStage5],
  clavel: [
    CarnationStage1,
    CarnationStage2,
    CarnationStage3,
    CarnationStage4,
    CarnationStage5,
    CarnationStage6,
  ],
  lirio: [IrisStage1, IrisStage2, IrisStage3, IrisStage4, IrisStage5, IrisStage6],
  peonia: [
    PeonyStage1,
    PeonyStage2,
    PeonyStage3,
    PeonyStage4,
    PeonyStage5,
    PeonyStage6,
    PeonyStage7,
  ],
  cactus: [CactusStage1, CactusStage2, CactusStage3, CactusStage4, CactusStage5, CactusStage6],
  orquidea: [
    OrchidStage1,
    OrchidStage2,
    OrchidStage3,
    OrchidStage4,
    OrchidStage5,
    OrchidStage6,
    OrchidStage7,
    OrchidStage8,
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
  /** Render at natural aspect ratio using the species' real viewBox dimensions */
  natural?: boolean;
}

export function PlantDisplay({ stage, speciesId = "daisy", size = "md", natural = false }: PlantDisplayProps) {
  const stages = SPECIES_STAGES[speciesId] ?? DAISY_STAGES;
  const clampedStage = Math.max(1, Math.min(stage, stages.length));
  const StageComponent = stages[clampedStage - 1];

  const meta = SPECIES_META[speciesId] ?? { vw: 16, vh: 16 };

  let svgWidth: number;
  let svgHeight: number;
  let viewBox: string;

  if (natural) {
    // Scale so the longer axis = xl size, preserving aspect ratio
    const base = SIZE_PX["xl"];
    const scale = base / Math.max(meta.vw, meta.vh);
    svgWidth = Math.round(meta.vw * scale);
    svgHeight = Math.round(meta.vh * scale);
    viewBox = `0 0 ${meta.vw} ${meta.vh}`;
  } else {
    const px_size = SIZE_PX[size];
    svgWidth = px_size;
    svgHeight = px_size;
    viewBox = `0 0 ${meta.vw} ${meta.vh}`;
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", display: "block" }}
    >
      <StageComponent />
    </svg>
  );
}

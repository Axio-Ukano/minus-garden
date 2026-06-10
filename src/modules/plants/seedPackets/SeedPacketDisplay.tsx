// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Seed packet display ──────────────────────────────────────────────────────
// Renders the seed packet sprite for a species at app-standard pixel sizes.
// Counterpart of PlantDisplay for the future shop feature.

import { SEED_PACKET_SPRITES, DaisySeedPacket, PACKET_GRID } from "./SeedPacketSprites";
import type { PlantSize } from "../PlantDisplay";

const SIZE_PX = { sm: 32, md: 64, lg: 80, xl: 120, xxl: 200 } as const;

interface SeedPacketDisplayProps {
  speciesId: string;
  size?: PlantSize;
}

export function SeedPacketDisplay({ speciesId, size = "md" }: SeedPacketDisplayProps) {
  const Packet = SEED_PACKET_SPRITES[speciesId] ?? DaisySeedPacket;

  // Longest axis = requested size, preserving the packet's 24×28 aspect ratio
  const scale = SIZE_PX[size] / Math.max(PACKET_GRID.w, PACKET_GRID.h);
  const width = Math.round(PACKET_GRID.w * scale);
  const height = Math.round(PACKET_GRID.h * scale);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${PACKET_GRID.w} ${PACKET_GRID.h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges", display: "block" }}
    >
      <Packet />
    </svg>
  );
}

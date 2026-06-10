// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

/* eslint-disable react-refresh/only-export-components -- sprite-parts module: exports drawing helpers alongside the Pot component */
// ─── Shared pot sprite ────────────────────────────────────────────────────────
// Every potted species renders the SAME pot on the same 24×30 grid, so pots are
// pixel-identical across plants. Future "pot colors" feature = swap PotPalette.
// Grid contract for potted species (see PlantDisplay SPECIES_META):
//   viewBox 0 0 24 30 — pot occupies y=20..29, plants grow on y=0..21,
//   stems are planted at the soil line (SOIL_Y) around center x=11..12.

import type { JSX } from "react";

export const POT_GRID = { w: 24, h: 30 } as const;
/** Soil surface row — stems should reach down to this y. */
export const SOIL_Y = 21;

/** 1×1-and-up pixel block helper shared by all plant sprites. */
export function px(x: number, y: number, w: number, h: number, fill: string): JSX.Element {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

export interface PotPalette {
  outline: string;
  clay: string;
  clayLight: string;
  clayDark: string;
  clayDeep: string;
  rimShadow: string;
  soil: string;
  soilDark: string;
  soilLight: string;
}

export const TERRACOTTA: PotPalette = {
  outline: "#3a2317",
  clay: "#c8956a",
  clayLight: "#e2b289",
  clayDark: "#a06b44",
  clayDeep: "#7e5132",
  rimShadow: "#8a5a3a",
  soil: "#6b4e38",
  soilDark: "#4a3326",
  soilLight: "#8a6a4c",
};

/**
 * Classic flared terracotta pot with soil, outlined for readability on both
 * light and dark app themes. Rim x=4..19, body tapers from 14 to 10 wide.
 */
export function Pot({ palette = TERRACOTTA }: { palette?: PotPalette } = {}) {
  const P = palette;
  return (
    <>
      {/* soil — visible inside the rim opening */}
      {px(7, 20, 10, 1, P.soilDark)}
      {px(6, 21, 12, 1, P.soil)}
      {px(8, 21, 2, 1, P.soilDark)}
      {px(13, 21, 2, 1, P.soilDark)}
      {px(11, 21, 1, 1, P.soilLight)}
      {/* flared rim */}
      {px(4, 22, 1, 2, P.outline)}
      {px(19, 22, 1, 2, P.outline)}
      {px(5, 22, 14, 1, P.clayLight)}
      {px(5, 23, 14, 1, P.clay)}
      {px(5, 23, 1, 1, P.clayLight)}
      {px(15, 23, 4, 1, P.clayDark)}
      {/* body — upper */}
      {px(5, 24, 1, 3, P.outline)}
      {px(18, 24, 1, 3, P.outline)}
      {px(6, 24, 12, 1, P.rimShadow)}
      {px(6, 25, 12, 2, P.clay)}
      {px(7, 25, 2, 2, P.clayLight)}
      {px(15, 25, 3, 2, P.clayDark)}
      {/* body — lower taper */}
      {px(6, 27, 1, 2, P.outline)}
      {px(17, 27, 1, 2, P.outline)}
      {px(7, 27, 10, 1, P.clay)}
      {px(8, 27, 1, 1, P.clayLight)}
      {px(14, 27, 3, 1, P.clayDark)}
      {px(7, 28, 10, 1, P.clayDeep)}
      {/* base */}
      {px(7, 29, 10, 1, P.outline)}
    </>
  );
}

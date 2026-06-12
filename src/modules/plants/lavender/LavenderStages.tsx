// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ── Lavender — grid 24×30, shared pot (see shared/PotSprite) ─────────────────
// Bushy shrub with grey-green foliage and purple spikes.
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#5a7a4c",
  stemDark: "#3e5a36",
  leaf: "#6e9460",
  leafLight: "#92b884",
  leafDark: "#4c6e42",
  leafShine: "#b4d4a0",
  spike: "#9a6ac8",
  spikeLight: "#bc92e2",
  spikePale: "#d8baf2",
  spikeDark: "#6a4292",
  spikeDeep: "#4c2a72",
} as const;

// Lavender spike — 2px wide head with side buds
function Spike(x: number, topY: number, h: number) {
  const rects = [];
  rects.push(px(x, topY - 1, 2, 1, C.spikePale));
  for (let i = 0; i < h; i++) {
    const y = topY + i;
    rects.push(px(x, y, 2, 1, i % 2 === 0 ? C.spikeLight : C.spike));
    if (i % 2 === 1 && i < h - 1) {
      rects.push(px(x - 1, y, 1, 1, C.spike));
      rects.push(px(x + 2, y, 1, 1, C.spikeDark));
    }
  }
  rects.push(px(x, topY + h - 1, 2, 1, C.spikeDeep));
  return <>{rects}</>;
}

// Bush of narrow leaves at base
function Bush(full: boolean) {
  return (
    <>
      {px(9, 16, 1, 5, C.leaf)}
      {px(10, 17, 1, 4, C.leafLight)}
      {px(11, 15, 2, 6, C.leaf)}
      {px(11, 15, 1, 2, C.leafShine)}
      {px(13, 17, 1, 4, C.leafLight)}
      {px(14, 16, 1, 5, C.leaf)}
      {full && (
        <>
          {px(7, 17, 1, 4, C.leaf)}
          {px(8, 18, 1, 3, C.leafDark)}
          {px(6, 18, 1, 3, C.leafDark)}
          {px(15, 18, 1, 3, C.leafDark)}
          {px(16, 17, 1, 4, C.leaf)}
          {px(17, 18, 1, 3, C.leafDark)}
          {px(5, 19, 1, 2, C.leafDark)}
          {px(18, 19, 1, 2, C.leafDark)}
        </>
      )}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function LavenderStage1() {
  // Tiny grey-green shoot
  return (
    <>
      <Pot />
      {px(11, 18, 1, 4, C.leaf)}
      {px(12, 17, 1, 5, C.leafLight)}
      {px(13, 18, 1, 4, C.leafDark)}
      {px(10, 19, 1, 3, C.leafDark)}
      {px(12, 16, 1, 1, C.leafShine)}
    </>
  );
}

export function LavenderStage2() {
  // Young bush of narrow leaves
  return (
    <>
      <Pot />
      {Bush(false)}
    </>
  );
}

export function LavenderStage3() {
  // Full bush with three stalks and first purple buds
  return (
    <>
      <Pot />
      {Bush(true)}
      {/* stalks */}
      {px(11, 10, 1, 6, C.stem)}
      {px(12, 10, 1, 6, C.stemDark)}
      {px(8, 12, 1, 5, C.stem)}
      {px(15, 12, 1, 5, C.stemDark)}
      {/* buds */}
      {px(10, 8, 2, 2, C.spike)}
      {px(10, 8, 1, 1, C.spikeLight)}
      {px(7, 10, 2, 2, C.spikeDark)}
      {px(15, 10, 2, 2, C.spike)}
      {px(15, 10, 1, 1, C.spikeLight)}
    </>
  );
}

export function LavenderStage4() {
  // Central spike in bloom and two side spikes starting
  return (
    <>
      <Pot />
      {Bush(true)}
      {/* stalks */}
      {px(11, 11, 1, 5, C.stem)}
      {px(12, 11, 1, 5, C.stemDark)}
      {px(8, 12, 1, 5, C.stem)}
      {px(15, 12, 1, 5, C.stemDark)}
      {/* spikes */}
      {Spike(11, 4, 7)}
      {Spike(7, 8, 4)}
      {Spike(15, 8, 4)}
    </>
  );
}

export function LavenderStage5() {
  // Full lavender — five loaded spikes
  return (
    <>
      <Pot />
      {Bush(true)}
      {/* stalks */}
      {px(11, 10, 1, 6, C.stem)}
      {px(12, 10, 1, 6, C.stemDark)}
      {px(7, 11, 1, 6, C.stem)}
      {px(8, 11, 1, 6, C.stemDark)}
      {px(15, 11, 1, 6, C.stem)}
      {px(16, 11, 1, 6, C.stemDark)}
      {px(4, 13, 1, 6, C.stemDark)}
      {px(19, 13, 1, 6, C.stemDark)}
      {/* spikes */}
      {Spike(11, 2, 8)}
      {Spike(7, 5, 6)}
      {Spike(15, 5, 6)}
      {Spike(4, 8, 5)}
      {Spike(18, 8, 5)}
    </>
  );
}

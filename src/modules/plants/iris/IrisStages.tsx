// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ── Iris — grid 24×30, shared pot (see shared/PotSprite) ─────────────────────
// Fan of sword leaves and flower with lilac standards and violet falls.
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#4a8a2e",
  stemDark: "#2d5a1e",
  leaf: "#3f8f35",
  leafLight: "#5cb24c",
  leafDark: "#246322",
  leafShine: "#7ed468",
  lilac: "#a886ec",
  lilacLight: "#c8aeff",
  lilacPale: "#e2d6ff",
  violet: "#6a48cc",
  violetMid: "#8462e0",
  violetDark: "#4c2ea0",
  beard: "#f8c838",
} as const;

// Sword leaf in stair-step from base outward
function Blade(dir: -1 | 1, baseX: number, len: number) {
  const rects = [];
  for (let i = 0; i < len; i++) {
    const x = baseX + dir * i;
    const y = 19 - 2 * i;
    const isTip = i === len - 1;
    rects.push(
      px(dir === -1 && isTip ? x + 1 : x, y, isTip ? 1 : 2, 2, isTip ? C.leafLight : C.leaf)
    );
    if (!isTip && i > 0) {
      rects.push(px(dir === -1 ? x + 1 : x, y + 1, 1, 1, C.leafDark));
    }
  }
  return <>{rects}</>;
}

// Center blade straight
function CenterBlade(topY: number) {
  const rects = [];
  for (let y = topY; y <= 21; y++) {
    rects.push(px(11, y, 2, 1, C.leaf));
  }
  rects.push(px(11, topY, 1, 2, C.leafLight));
  rects.push(px(12, topY, 1, 1, C.leafShine));
  return <>{rects}</>;
}

function Stalk(topY: number) {
  const rects = [];
  for (let y = topY; y <= 21; y++) {
    rects.push(px(11, y, 2, 1, y % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function IrisStage1() {
  // First sword leaf piercing the soil
  return (
    <>
      <Pot />
      {px(11, 16, 1, 1, C.leafLight)}
      {px(11, 17, 2, 5, C.leaf)}
      {px(12, 17, 1, 2, C.leafLight)}
      {px(13, 19, 1, 3, C.leafDark)}
    </>
  );
}

export function IrisStage2() {
  // Young fan of three leaves
  return (
    <>
      <Pot />
      {Blade(-1, 9, 3)}
      {Blade(1, 13, 3)}
      {CenterBlade(12)}
    </>
  );
}

export function IrisStage3() {
  // Mature fan, tall leaves
  return (
    <>
      <Pot />
      {Blade(-1, 9, 5)}
      {Blade(1, 13, 5)}
      {Blade(-1, 10, 3)}
      {Blade(1, 12, 3)}
      {CenterBlade(8)}
    </>
  );
}

export function IrisStage4() {
  // Flower stalk with teardrop bud
  return (
    <>
      <Pot />
      {Blade(-1, 9, 5)}
      {Blade(1, 13, 5)}
      {Blade(-1, 10, 3)}
      {Blade(1, 12, 3)}
      {Stalk(7)}
      {/* bud */}
      {px(11, 1, 2, 1, C.lilac)}
      {px(10, 2, 4, 2, C.violetMid)}
      {px(10, 4, 4, 2, C.violet)}
      {px(10, 5, 1, 1, C.violetDark)}
      {px(13, 5, 1, 1, C.violetDark)}
      {/* spathe */}
      {px(10, 6, 4, 1, C.leafDark)}
      {px(13, 4, 1, 2, C.leaf)}
    </>
  );
}

export function IrisStage5() {
  // Flower half-open — standards visible, falls beginning
  return (
    <>
      <Pot />
      {Blade(-1, 9, 5)}
      {Blade(1, 13, 5)}
      {Blade(-1, 10, 3)}
      {Blade(1, 12, 3)}
      {Stalk(8)}
      {/* standards */}
      {px(10, 1, 4, 1, C.lilac)}
      {px(9, 2, 6, 1, C.lilac)}
      {px(11, 2, 2, 1, C.lilacPale)}
      {px(9, 3, 6, 1, C.lilacLight)}
      {px(10, 4, 4, 1, C.violetMid)}
      {/* falls peeking */}
      {px(8, 5, 2, 2, C.violet)}
      {px(14, 5, 2, 2, C.violet)}
      {px(11, 5, 2, 2, C.violetMid)}
      {/* beards */}
      {px(9, 5, 1, 1, C.beard)}
      {px(14, 5, 1, 1, C.beard)}
    </>
  );
}

export function IrisStage6() {
  // Full iris — upright standards, falls with golden beards
  return (
    <>
      <Pot />
      {Blade(-1, 9, 5)}
      {Blade(1, 13, 5)}
      {Blade(-1, 10, 3)}
      {Blade(1, 12, 3)}
      {Stalk(9)}
      {/* standards — lilac dome */}
      {px(10, 0, 4, 1, C.lilacPale)}
      {px(9, 1, 6, 1, C.lilac)}
      {px(11, 1, 2, 1, C.lilacPale)}
      {px(8, 2, 8, 1, C.lilac)}
      {px(10, 2, 4, 1, C.lilacLight)}
      {px(8, 3, 8, 1, C.lilacLight)}
      {px(8, 3, 1, 1, C.violetMid)}
      {px(15, 3, 1, 1, C.violetMid)}
      {/* waist */}
      {px(9, 4, 6, 1, C.violetMid)}
      {/* falls — hanging petals */}
      {px(7, 5, 3, 2, C.violet)}
      {px(6, 5, 1, 2, C.violetDark)}
      {px(7, 7, 2, 2, C.violetDark)}
      {px(14, 5, 3, 2, C.violet)}
      {px(17, 5, 1, 2, C.violetDark)}
      {px(15, 7, 2, 2, C.violetDark)}
      {px(10, 5, 4, 3, C.violetMid)}
      {px(11, 8, 2, 1, C.violetDark)}
      {/* golden beards */}
      {px(8, 5, 1, 1, C.beard)}
      {px(15, 5, 1, 1, C.beard)}
      {px(11, 5, 2, 1, C.beard)}
      {/* side bud */}
      {px(15, 9, 2, 1, C.lilac)}
      {px(15, 10, 2, 2, C.violet)}
      {px(15, 12, 2, 1, C.leafDark)}
      {px(14, 12, 1, 3, C.stem)}
    </>
  );
}

// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ── Sunflower — grid 24×30, shared pot (see shared/PotSprite) ────────────────
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#4a8a2e",
  stemDark: "#2d5a1e",
  stemLight: "#6cb244",
  leaf: "#3a7a24",
  leafLight: "#5aa83c",
  leafDark: "#1e4a14",
  leafVein: "#2d6a1c",
  leafShine: "#82cc58",
  seedHusk: "#3a2a1e",
  seedStripe: "#c8b89a",
  bud: "#5aa83c",
  budDark: "#2d6a1c",
  petal: "#f8c830",
  petalLight: "#ffe066",
  petalDark: "#d89610",
  petalDeep: "#b87808",
  disk: "#5a3618",
  diskMid: "#7a4e28",
  diskLight: "#9a6a3c",
  diskDark: "#3a2210",
} as const;

function Stem(topY: number) {
  const rects = [];
  for (let y = topY; y <= 21; y++) {
    rects.push(px(11, y, 2, 1, y % 4 === 0 ? C.stemDark : C.stem));
  }
  rects.push(px(11, topY, 1, 1, C.stemLight));
  return <>{rects}</>;
}

function BigLeafLeft(y: number) {
  return (
    <>
      {px(7, y, 4, 1, C.leafLight)}
      {px(5, y + 1, 6, 1, C.leaf)}
      {px(8, y + 1, 2, 1, C.leafShine)}
      {px(4, y + 2, 7, 1, C.leaf)}
      {px(5, y + 2, 2, 1, C.leafVein)}
      {px(6, y + 3, 4, 1, C.leafDark)}
    </>
  );
}

function BigLeafRight(y: number) {
  return (
    <>
      {px(13, y, 4, 1, C.leafLight)}
      {px(13, y + 1, 6, 1, C.leaf)}
      {px(14, y + 1, 2, 1, C.leafShine)}
      {px(13, y + 2, 7, 1, C.leaf)}
      {px(17, y + 2, 2, 1, C.leafVein)}
      {px(14, y + 3, 4, 1, C.leafDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function SunflowerStage1() {
  // Shoot with sunflower seed husk still on
  return (
    <>
      <Pot />
      {px(11, 18, 2, 4, C.stem)}
      {/* striped husk */}
      {px(11, 14, 2, 1, C.seedHusk)}
      {px(10, 15, 4, 3, C.seedHusk)}
      {px(11, 15, 1, 3, C.seedStripe)}
      {px(13, 15, 1, 3, C.seedStripe)}
      {/* baby leaves escaping */}
      {px(9, 18, 2, 1, C.leafLight)}
      {px(13, 18, 2, 1, C.leafLight)}
    </>
  );
}

export function SunflowerStage2() {
  // Seedling with broad cotyledons
  return (
    <>
      <Pot />
      {Stem(15)}
      {/* left cotyledon */}
      {px(7, 13, 3, 1, C.leafLight)}
      {px(6, 14, 5, 1, C.leaf)}
      {px(7, 15, 3, 1, C.leafDark)}
      {/* right cotyledon */}
      {px(14, 12, 3, 1, C.leafLight)}
      {px(13, 13, 5, 1, C.leaf)}
      {px(14, 14, 3, 1, C.leafDark)}
    </>
  );
}

export function SunflowerStage3() {
  // Mid-stem with first large heart-shaped leaves
  return (
    <>
      <Pot />
      {Stem(11)}
      {BigLeafLeft(15)}
      {BigLeafRight(13)}
      {/* top tuft */}
      {px(11, 8, 2, 1, C.leafShine)}
      {px(10, 9, 4, 1, C.leafLight)}
      {px(10, 10, 4, 1, C.leaf)}
    </>
  );
}

export function SunflowerStage4() {
  // Tall stem with drooping green bud
  return (
    <>
      <Pot />
      {Stem(8)}
      {BigLeafLeft(16)}
      {BigLeafRight(13)}
      {/* mid baby leaves */}
      {px(8, 10, 3, 1, C.leaf)}
      {px(9, 9, 2, 1, C.leafLight)}
      {px(13, 11, 3, 1, C.leaf)}
      {px(13, 10, 2, 1, C.leafLight)}
      {/* bud */}
      {px(11, 2, 3, 1, C.bud)}
      {px(10, 3, 5, 4, C.bud)}
      {px(10, 3, 1, 4, C.budDark)}
      {px(10, 6, 5, 1, C.budDark)}
      {px(12, 3, 1, 2, C.leafShine)}
      {/* bracts */}
      {px(9, 4, 1, 3, C.leaf)}
      {px(15, 4, 1, 3, C.leaf)}
      {/* yellow opening */}
      {px(12, 2, 1, 1, C.petalLight)}
    </>
  );
}

export function SunflowerStage5() {
  // Bud opening — petal fringe around young disc
  return (
    <>
      <Pot />
      {Stem(10)}
      {BigLeafLeft(16)}
      {BigLeafRight(13)}
      {/* petal fringe */}
      {px(10, 2, 4, 2, C.petal)}
      {px(11, 2, 2, 1, C.petalLight)}
      {px(8, 3, 2, 2, C.petal)}
      {px(14, 3, 2, 2, C.petal)}
      {px(7, 5, 2, 2, C.petal)}
      {px(15, 5, 2, 2, C.petal)}
      {px(10, 7, 4, 1, C.petalDark)}
      {/* lower bracts */}
      {px(9, 8, 6, 1, C.bud)}
      {px(10, 9, 4, 1, C.budDark)}
      {/* young disc */}
      {px(10, 4, 4, 3, C.disk)}
      {px(10, 4, 4, 1, C.diskMid)}
    </>
  );
}

export function SunflowerStage6() {
  // Medium open flower
  return (
    <>
      <Pot />
      {Stem(12)}
      {BigLeafLeft(16)}
      {BigLeafRight(14)}
      {/* petals north and south */}
      {px(9, 1, 6, 3, C.petal)}
      {px(10, 1, 4, 1, C.petalLight)}
      {px(9, 9, 6, 2, C.petal)}
      {px(10, 11, 4, 1, C.petal)}
      {/* petals west */}
      {px(5, 3, 4, 3, C.petal)}
      {px(5, 3, 1, 2, C.petalLight)}
      {px(5, 6, 4, 3, C.petal)}
      {/* petals east */}
      {px(15, 3, 4, 3, C.petal)}
      {px(18, 3, 1, 2, C.petalLight)}
      {px(15, 6, 4, 3, C.petal)}
      {/* diagonals */}
      {px(6, 1, 3, 2, C.petal)}
      {px(15, 1, 3, 2, C.petal)}
      {px(6, 9, 3, 2, C.petal)}
      {px(15, 9, 3, 2, C.petal)}
      {/* base shadows */}
      {px(9, 3, 6, 1, C.petalDark)}
      {px(9, 9, 6, 1, C.petalDark)}
      {px(8, 4, 1, 5, C.petalDark)}
      {px(15, 4, 1, 5, C.petalDark)}
      {/* disc */}
      {px(9, 4, 6, 5, C.disk)}
      {px(9, 4, 6, 1, C.diskMid)}
      {px(10, 5, 2, 2, C.diskLight)}
      {px(13, 6, 1, 1, C.diskDark)}
      {px(11, 7, 1, 1, C.diskDark)}
    </>
  );
}

export function SunflowerStage7() {
  // Full sunflower — large head with textured disc
  return (
    <>
      <Pot />
      {Stem(13)}
      {BigLeafLeft(17)}
      {BigLeafRight(15)}
      {/* mid baby leaves */}
      {px(8, 14, 3, 1, C.leaf)}
      {px(13, 13, 3, 1, C.leaf)}
      {/* petal crown — north */}
      {px(8, 0, 8, 3, C.petal)}
      {px(9, 0, 6, 1, C.petalLight)}
      {/* south */}
      {px(8, 10, 8, 3, C.petal)}
      {px(9, 12, 6, 1, C.petalDark)}
      {/* west */}
      {px(4, 3, 4, 2, C.petal)}
      {px(3, 5, 5, 3, C.petal)}
      {px(3, 5, 2, 1, C.petalLight)}
      {px(4, 8, 4, 2, C.petal)}
      {/* east */}
      {px(16, 3, 4, 2, C.petal)}
      {px(16, 5, 5, 3, C.petal)}
      {px(19, 5, 2, 1, C.petalLight)}
      {px(16, 8, 4, 2, C.petal)}
      {/* diagonals */}
      {px(5, 1, 3, 2, C.petal)}
      {px(16, 1, 3, 2, C.petal)}
      {px(5, 10, 3, 2, C.petal)}
      {px(16, 10, 3, 2, C.petal)}
      {/* ring base shadows */}
      {px(8, 2, 8, 1, C.petalDark)}
      {px(8, 10, 8, 1, C.petalDeep)}
      {px(7, 3, 1, 7, C.petalDark)}
      {px(16, 3, 1, 7, C.petalDark)}
      {/* large textured disc */}
      {px(8, 3, 8, 7, C.disk)}
      {px(8, 3, 8, 1, C.diskMid)}
      {px(8, 4, 1, 5, C.diskMid)}
      {px(9, 4, 3, 1, C.diskLight)}
      {px(9, 5, 1, 2, C.diskLight)}
      {px(12, 5, 1, 1, C.diskDark)}
      {px(14, 7, 1, 1, C.diskDark)}
      {px(10, 8, 1, 1, C.diskDark)}
      {px(13, 8, 1, 1, C.diskDark)}
      {px(8, 9, 8, 1, C.diskDark)}
    </>
  );
}

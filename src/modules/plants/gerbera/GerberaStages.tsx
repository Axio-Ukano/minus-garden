// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ── Gerbera — grid 24×30, shared pot (see shared/PotSprite) ──────────────────
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#4a8a2e",
  stemDark: "#2d5a1e",
  leaf: "#3a7a24",
  leafLight: "#5aa83c",
  leafDark: "#1e4a14",
  leafShine: "#82cc58",
  bud: "#5aa83c",
  budDark: "#2d6a1c",
  petal: "#f57828",
  petalLight: "#ff9d52",
  petalPale: "#ffbe85",
  petalDeep: "#c44814",
  petalRed: "#a82812",
  centerDark: "#5e2a10",
  center: "#7c3c16",
  eye: "#e8b83c",
  eyeGreen: "#8aa632",
} as const;

function Stalk(topY: number) {
  const rects = [];
  for (let y = topY; y <= 18; y++) {
    rects.push(px(11, y, 2, 1, y % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

// Basal rosette — gerbera leaves grow at ground level
function Rosette() {
  return (
    <>
      {/* long left leaf */}
      {px(4, 17, 3, 1, C.leafLight)}
      {px(3, 18, 5, 1, C.leaf)}
      {px(5, 19, 5, 1, C.leaf)}
      {px(7, 20, 4, 1, C.leafDark)}
      {/* short left leaf */}
      {px(7, 16, 2, 1, C.leafShine)}
      {px(8, 17, 3, 1, C.leafLight)}
      {px(9, 18, 3, 1, C.leaf)}
      {/* long right leaf */}
      {px(17, 17, 3, 1, C.leafLight)}
      {px(16, 18, 5, 1, C.leaf)}
      {px(14, 19, 5, 1, C.leaf)}
      {px(13, 20, 4, 1, C.leafDark)}
      {/* short right leaf */}
      {px(15, 16, 2, 1, C.leafShine)}
      {px(13, 17, 3, 1, C.leafLight)}
      {px(12, 18, 3, 1, C.leaf)}
      {/* rosette center */}
      {px(10, 19, 4, 2, C.leaf)}
      {px(11, 18, 2, 1, C.leafLight)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function GerberaStage1() {
  // Ground-level shoot with two flat baby leaves
  return (
    <>
      <Pot />
      {px(11, 19, 2, 3, C.stem)}
      {px(8, 18, 3, 1, C.leafLight)}
      {px(8, 19, 2, 1, C.leaf)}
      {px(13, 18, 3, 1, C.leaf)}
      {px(14, 19, 2, 1, C.leafDark)}
      {px(11, 18, 2, 1, C.leafShine)}
    </>
  );
}

export function GerberaStage2() {
  // Young rosette of toothed leaves
  return (
    <>
      <Pot />
      {/* small rosette */}
      {px(6, 18, 3, 1, C.leafLight)}
      {px(5, 19, 5, 1, C.leaf)}
      {px(7, 20, 4, 1, C.leafDark)}
      {px(15, 18, 3, 1, C.leafLight)}
      {px(14, 19, 5, 1, C.leaf)}
      {px(13, 20, 4, 1, C.leafDark)}
      {px(10, 17, 4, 1, C.leafShine)}
      {px(9, 18, 6, 1, C.leafLight)}
      {px(10, 19, 4, 2, C.leaf)}
    </>
  );
}

export function GerberaStage3() {
  // Mature rosette with flower stalk and orange-tipped bud
  return (
    <>
      <Pot />
      {Stalk(9)}
      {Rosette()}
      {/* bud */}
      {px(10, 6, 4, 3, C.bud)}
      {px(10, 6, 1, 3, C.budDark)}
      {px(13, 6, 1, 3, C.budDark)}
      {px(11, 5, 2, 1, C.bud)}
      {/* orange tip peeking out */}
      {px(11, 4, 2, 1, C.petalLight)}
      {px(11, 3, 1, 1, C.petalPale)}
    </>
  );
}

export function GerberaStage4() {
  // Half-open flower — horizontal petals, visible disc
  return (
    <>
      <Pot />
      {Stalk(8)}
      {Rosette()}
      {/* upper petals */}
      {px(9, 1, 6, 2, C.petal)}
      {px(10, 1, 4, 1, C.petalLight)}
      {/* diagonals */}
      {px(6, 2, 3, 2, C.petal)}
      {px(15, 2, 3, 2, C.petal)}
      {/* side petals */}
      {px(4, 4, 5, 2, C.petal)}
      {px(4, 4, 1, 2, C.petalLight)}
      {px(15, 4, 5, 2, C.petal)}
      {px(19, 4, 1, 2, C.petalLight)}
      {/* lower petals drooping */}
      {px(8, 6, 8, 2, C.petalDeep)}
      {px(6, 6, 2, 2, C.petalDeep)}
      {px(16, 6, 2, 2, C.petalDeep)}
      {/* disc */}
      {px(10, 3, 4, 4, C.centerDark)}
      {px(11, 4, 2, 2, C.eye)}
    </>
  );
}

export function GerberaStage5() {
  // Full gerbera — double petal ring and green-yellow eye
  return (
    <>
      <Pot />
      {Stalk(11)}
      {Rosette()}
      {/* outer ring — north and south */}
      {px(9, 0, 6, 3, C.petal)}
      {px(10, 0, 4, 1, C.petalLight)}
      {px(9, 9, 6, 3, C.petal)}
      {px(10, 11, 4, 1, C.petalDeep)}
      {/* outer ring — west */}
      {px(4, 3, 5, 2, C.petal)}
      {px(3, 5, 6, 2, C.petal)}
      {px(3, 5, 2, 1, C.petalLight)}
      {px(4, 7, 5, 2, C.petal)}
      {/* outer ring — east */}
      {px(15, 3, 5, 2, C.petal)}
      {px(15, 5, 6, 2, C.petal)}
      {px(19, 5, 2, 1, C.petalLight)}
      {px(15, 7, 5, 2, C.petal)}
      {/* diagonals */}
      {px(5, 1, 3, 2, C.petal)}
      {px(16, 1, 3, 2, C.petal)}
      {px(5, 9, 3, 2, C.petal)}
      {px(16, 9, 3, 2, C.petal)}
      {/* red inner ring */}
      {px(8, 2, 8, 1, C.petalRed)}
      {px(8, 9, 8, 1, C.petalRed)}
      {px(8, 3, 1, 6, C.petalRed)}
      {px(15, 3, 1, 6, C.petalRed)}
      {/* central disc */}
      {px(9, 3, 6, 6, C.centerDark)}
      {px(10, 4, 4, 4, C.center)}
      {px(11, 5, 2, 2, C.eye)}
      {px(11, 5, 1, 1, C.eyeGreen)}
      {px(13, 7, 1, 1, C.eye)}
      {px(10, 7, 1, 1, C.eye)}
    </>
  );
}

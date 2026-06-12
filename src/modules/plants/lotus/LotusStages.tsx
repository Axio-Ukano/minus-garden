// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ── Lotus — grid 28×20, water scene (no pot — grows in a pond) ───────────────
// Pond with mud, lily pads with V-shaped notch and flower with pointed petals
// and golden receptacle.
import { px } from "../shared/PotSprite";

const C = {
  waterDeep: "#1c3f74",
  waterMid: "#2c5da4",
  waterShallow: "#3a6fc0",
  waterLight: "#4f86d8",
  waterShine: "#7fb0ee",
  waterFoam: "#cfe2fb",
  mud: "#4a3828",
  mudDark: "#2e2218",
  mudLight: "#65503a",
  stem: "#3f7a34",
  stemLight: "#5ca84c",
  stemUnder: "#2c5630",
  padMid: "#3a8a30",
  padLight: "#56b048",
  padShine: "#82d46e",
  padDark: "#236020",
  petalWhite: "#fff6f8",
  petalPale: "#ffd9e4",
  petalPink: "#f993b4",
  petalDark: "#e85890",
  petalDeep: "#c03468",
  pod: "#f5cf3e",
  podDot: "#b8932a",
} as const;

// Pond — water with sparkles and mud bottom
function WaterBase() {
  return (
    <>
      {px(0, 13, 28, 1, C.waterLight)}
      {px(0, 14, 28, 2, C.waterMid)}
      {px(0, 16, 28, 2, C.waterDeep)}
      {/* sparkles */}
      {px(2, 13, 3, 1, C.waterShine)}
      {px(9, 13, 2, 1, C.waterFoam)}
      {px(17, 13, 3, 1, C.waterShine)}
      {px(23, 13, 2, 1, C.waterFoam)}
      {px(5, 15, 3, 1, C.waterShallow)}
      {px(19, 15, 3, 1, C.waterShallow)}
      {/* mud */}
      {px(0, 18, 28, 2, C.mud)}
      {px(0, 18, 28, 1, C.mudLight)}
      {px(3, 19, 3, 1, C.mudDark)}
      {px(13, 19, 4, 1, C.mudDark)}
      {px(22, 19, 3, 1, C.mudDark)}
    </>
  );
}

// Floating lily pad — V-shaped notch at front
function Pad(x: number, w: number) {
  const notch = x + Math.floor(w / 2);
  return (
    <>
      {px(x + 1, 12, w - 2, 1, C.padLight)}
      {px(x + 2, 12, 2, 1, C.padShine)}
      {px(x, 13, w, 1, C.padMid)}
      {px(x, 13, 1, 1, C.padDark)}
      {px(x + w - 1, 13, 1, 1, C.padDark)}
      {px(notch, 13, 1, 1, C.waterLight)}
    </>
  );
}

// Stalk — green above water, dark below
function Stalk(x: number, topY: number) {
  const rects = [];
  for (let y = topY; y <= 12; y++) rects.push(px(x, y, 1, 1, C.stem));
  for (let y = 14; y <= 17; y++) rects.push(px(x, y, 1, 1, C.stemUnder));
  return <>{rects}</>;
}

// Pointed bud — 3 wide, 4 tall
function LotusBud(x: number, y: number) {
  return (
    <>
      {px(x + 1, y, 1, 1, C.petalPale)}
      {px(x, y + 1, 3, 1, C.petalPink)}
      {px(x, y + 2, 3, 1, C.petalPink)}
      {px(x + 1, y + 2, 1, 1, C.petalPale)}
      {px(x, y + 3, 3, 1, C.petalDark)}
    </>
  );
}

// Open flower — 10×7 box, pointed petals and golden receptacle
function LotusFlower(x: number, y: number) {
  return (
    <>
      {px(x + 4, y, 2, 1, C.petalPale)}
      {px(x + 2, y + 1, 1, 1, C.petalPink)}
      {px(x + 3, y + 1, 4, 1, C.petalPale)}
      {px(x + 7, y + 1, 1, 1, C.petalPink)}
      {px(x + 1, y + 2, 2, 1, C.petalPink)}
      {px(x + 3, y + 2, 4, 1, C.petalWhite)}
      {px(x + 7, y + 2, 2, 1, C.petalPink)}
      {px(x, y + 3, 2, 1, C.petalDark)}
      {px(x + 2, y + 3, 2, 1, C.petalPink)}
      {px(x + 4, y + 3, 2, 1, C.petalWhite)}
      {px(x + 6, y + 3, 2, 1, C.petalPink)}
      {px(x + 8, y + 3, 2, 1, C.petalDark)}
      {px(x, y + 4, 1, 1, C.petalDeep)}
      {px(x + 1, y + 4, 2, 1, C.petalDark)}
      {px(x + 3, y + 4, 4, 1, C.pod)}
      {px(x + 4, y + 4, 1, 1, C.podDot)}
      {px(x + 6, y + 4, 1, 1, C.podDot)}
      {px(x + 7, y + 4, 2, 1, C.petalDark)}
      {px(x + 9, y + 4, 1, 1, C.petalDeep)}
      {px(x + 1, y + 5, 8, 1, C.petalDark)}
      {px(x + 2, y + 6, 6, 1, C.petalDeep)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function LotusStage1() {
  // Spear shoot breaking the surface
  return (
    <>
      <WaterBase />
      {px(13, 9, 1, 1, C.stemLight)}
      {px(13, 10, 1, 3, C.stem)}
      {px(13, 14, 1, 4, C.stemUnder)}
      {/* ripples */}
      {px(11, 13, 2, 1, C.waterFoam)}
      {px(15, 13, 2, 1, C.waterFoam)}
    </>
  );
}

export function LotusStage2() {
  // First lily pad
  return (
    <>
      <WaterBase />
      {px(13, 14, 1, 4, C.stemUnder)}
      {Pad(10, 6)}
      {px(17, 10, 1, 1, C.stemLight)}
      {px(17, 11, 1, 2, C.stem)}
      {px(17, 14, 1, 3, C.stemUnder)}
    </>
  );
}

export function LotusStage3() {
  // Two lily pads and central shoot
  return (
    <>
      <WaterBase />
      {px(7, 14, 1, 4, C.stemUnder)}
      {px(20, 14, 1, 4, C.stemUnder)}
      {Pad(4, 7)}
      {Pad(17, 6)}
      {px(13, 9, 1, 1, C.stemLight)}
      {px(13, 10, 1, 3, C.stem)}
      {px(13, 14, 1, 4, C.stemUnder)}
    </>
  );
}

export function LotusStage4() {
  // Low bud above water
  return (
    <>
      <WaterBase />
      {px(7, 14, 1, 4, C.stemUnder)}
      {px(21, 14, 1, 4, C.stemUnder)}
      {Pad(4, 7)}
      {Pad(19, 6)}
      {Stalk(13, 8)}
      {LotusBud(12, 4)}
    </>
  );
}

export function LotusStage5() {
  // Taller bud and third lily pad
  return (
    <>
      <WaterBase />
      {px(7, 14, 1, 4, C.stemUnder)}
      {px(21, 14, 1, 4, C.stemUnder)}
      {px(11, 14, 1, 4, C.stemUnder)}
      {Pad(4, 7)}
      {Pad(19, 6)}
      {Pad(9, 5)}
      {Stalk(13, 6)}
      {LotusBud(12, 2)}
    </>
  );
}

export function LotusStage6() {
  // Bud opening — tips separating
  return (
    <>
      <WaterBase />
      {px(6, 14, 1, 4, C.stemUnder)}
      {px(21, 14, 1, 4, C.stemUnder)}
      {px(10, 14, 1, 4, C.stemUnder)}
      {Pad(3, 7)}
      {Pad(19, 6)}
      {Pad(8, 5)}
      {Stalk(13, 6)}
      {/* bud opening */}
      {px(12, 1, 1, 1, C.petalPale)}
      {px(15, 1, 1, 1, C.petalPale)}
      {px(11, 2, 2, 1, C.petalPink)}
      {px(13, 2, 2, 1, C.petalWhite)}
      {px(15, 2, 2, 1, C.petalPink)}
      {px(11, 3, 6, 1, C.petalPink)}
      {px(13, 3, 2, 1, C.petalWhite)}
      {px(12, 4, 4, 1, C.petalDark)}
      {px(12, 5, 4, 1, C.petalDeep)}
    </>
  );
}

export function LotusStage7() {
  // Open flower
  return (
    <>
      <WaterBase />
      {px(5, 14, 1, 4, C.stemUnder)}
      {px(22, 14, 1, 4, C.stemUnder)}
      {Pad(2, 7)}
      {Pad(20, 6)}
      {Stalk(13, 10)}
      {LotusFlower(9, 3)}
    </>
  );
}

export function LotusStage8() {
  // Full flower with companion bud
  return (
    <>
      <WaterBase />
      {px(4, 14, 1, 4, C.stemUnder)}
      {px(22, 14, 1, 4, C.stemUnder)}
      {px(10, 14, 1, 4, C.stemUnder)}
      {Pad(1, 7)}
      {Pad(20, 6)}
      {Pad(8, 5)}
      {Stalk(13, 9)}
      {LotusFlower(9, 2)}
      {/* side bud */}
      {Stalk(5, 10)}
      {LotusBud(4, 6)}
    </>
  );
}

export function LotusStage9() {
  // Sacred lotus — large flower, bud, and pond full of life
  return (
    <>
      <WaterBase />
      {px(3, 14, 1, 4, C.stemUnder)}
      {px(23, 14, 1, 4, C.stemUnder)}
      {px(10, 14, 1, 4, C.stemUnder)}
      {Pad(0, 7)}
      {Pad(21, 7)}
      {Pad(8, 5)}
      {Pad(16, 5)}
      {Stalk(13, 8)}
      {LotusFlower(9, 1)}
      {/* extra outer petals */}
      {px(7, 4, 2, 1, C.petalDark)}
      {px(19, 4, 2, 1, C.petalDark)}
      {/* side bud */}
      {Stalk(5, 9)}
      {LotusBud(4, 5)}
      {/* life sparkles */}
      {px(6, 2, 1, 1, C.waterFoam)}
      {px(21, 1, 1, 1, C.waterFoam)}
      {px(24, 7, 1, 1, C.waterFoam)}
    </>
  );
}

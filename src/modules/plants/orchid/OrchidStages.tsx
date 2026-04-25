// ── Orchid palette ────────────────────────────────────────────────────────────
const C = {
  soil: "#6b4e38",
  soilDark: "#4a3326",
  pot: "#c8956a",
  potMid: "#b07850",
  potDark: "#3d2b1f",
  potShine: "#e0b48a",
  stem: "#4a7030",
  stemDark: "#2d4e20",
  stemLight: "#6a9048",
  leaf: "#3a6828",
  leafLight: "#5a8840",
  leafDark: "#204818",
  leafShine: "#78a858",
  aerial: "#5a7040",
  aerialDark: "#3a4e28",
  petalWhite: "#f8f0ff",
  petalLilac: "#d0a8e8",
  petalPurple: "#9060c0",
  petalPurpleDark: "#6040a0",
  petalVein: "#b080d8",
  petalPink: "#e880c0",
  lip: "#f040a0",
  lipYellow: "#f8c040",
  lipDark: "#c02080",
  column: "#f0d060",
  columnDark: "#c0a030",
  bud: "#c890e0",
  budDark: "#9060b0",
  spike: "#5a7838",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(3,  22, 14, 1, C.potShine)}
      {px(4,  22, 12, 1, C.pot)}
      {px(3,  22, 1,  1, C.potDark)}
      {px(16, 22, 1,  1, C.potDark)}
      {px(4,  23, 12, 3, C.pot)}
      {px(4,  23, 1,  3, C.potDark)}
      {px(15, 23, 1,  3, C.potDark)}
      {px(5,  23, 4,  3, C.potMid)}
      {px(4,  25, 12, 1, C.potDark)}
      {px(3,  26, 14, 1, C.soil)}
      {px(5,  26, 2,  1, C.soilDark)}
      {px(13, 26, 2,  1, C.soilDark)}
    </>
  );
}

// Hoja de orquídea — ancha, gruesa, brillante
function OrchidLeaf(x: number, y: number, w: number, h: number, flip: boolean) {
  return (
    <>
      {px(x, y, w, h, C.leaf)}
      {px(x, y, w, 1, C.leafLight)}
      {px(flip ? x+w-1 : x, y, 1, h, C.leafDark)}
      {px(flip ? x+1 : x+w-2, y, 2, 1, C.leafShine)}
      {px(x + Math.floor(w/2), y, 1, h, C.leafLight)}
    </>
  );
}

// Flor de orquídea completa — 5 pétalos + labelo
function OrchidFlower(cx: number, cy: number) {
  return (
    <>
      {/* sépalos dorsales (arriba) */}
      {px(cx-1, cy-4, 4, 3, C.petalLilac)}
      {px(cx-1, cy-4, 1, 3, C.petalPurpleDark)}
      {px(cx+2, cy-4, 1, 3, C.petalPurpleDark)}
      {px(cx,   cy-5, 2, 1, C.petalWhite)}
      {/* pétalos laterales */}
      {px(cx-4, cy-2, 3, 4, C.petalWhite)}
      {px(cx-4, cy-2, 1, 4, C.petalPurple)}
      {px(cx-3, cy-1, 3, 1, C.petalVein)}
      {px(cx+3, cy-2, 3, 4, C.petalWhite)}
      {px(cx+5, cy-2, 1, 4, C.petalPurple)}
      {px(cx+3, cy-1, 3, 1, C.petalVein)}
      {/* sépalos laterales (abajo) */}
      {px(cx-3, cy+1, 3, 3, C.petalLilac)}
      {px(cx-3, cy+1, 1, 3, C.petalPurpleDark)}
      {px(cx+2, cy+1, 3, 3, C.petalLilac)}
      {px(cx+4, cy+1, 1, 3, C.petalPurpleDark)}
      {/* labelo (lip) — el pétalo más llamativo */}
      {px(cx-1, cy-1, 4, 4, C.lip)}
      {px(cx,   cy-1, 2, 1, C.lipYellow)}
      {px(cx-1, cy,   4, 1, C.petalPink)}
      {px(cx-1, cy+2, 4, 1, C.lipDark)}
      {px(cx,   cy+3, 2, 1, C.lipDark)}
      {/* columna central */}
      {px(cx,   cy-2, 2, 2, C.column)}
      {px(cx,   cy-2, 1, 1, C.columnDark)}
    </>
  );
}

// Capullo de orquídea
function OrchidBud(x: number, y: number, size: number) {
  return (
    <>
      {px(x, y, size+2, size*2, C.bud)}
      {px(x, y, 1, size*2, C.budDark)}
      {px(x+size+1, y, 1, size*2, C.budDark)}
      {px(x, y+size*2-1, size+2, 1, C.budDark)}
      {px(x+1, y, size, 1, C.petalWhite)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function OrchidStage1() {
  return (
    <>
      <Pot />
      {px(9, 21, 2, 1, C.stem)}
      {px(8, 20, 4, 1, C.stemLight)}
    </>
  );
}

export function OrchidStage2() {
  return (
    <>
      <Pot />
      {OrchidLeaf(5, 17, 6, 4, false)}
      {OrchidLeaf(9, 18, 5, 3, true)}
    </>
  );
}

export function OrchidStage3() {
  return (
    <>
      <Pot />
      {OrchidLeaf(3, 16, 7, 5, false)}
      {OrchidLeaf(10,17, 7, 4, true)}
      {OrchidLeaf(5, 19, 5, 3, false)}
      {/* raíz aérea */}
      {px(2, 19, 1, 4, C.aerial)}
      {px(1, 22, 2, 1, C.aerialDark)}
    </>
  );
}

export function OrchidStage4() {
  return (
    <>
      <Pot />
      {OrchidLeaf(3, 16, 7, 5, false)}
      {OrchidLeaf(10,17, 7, 4, true)}
      {OrchidLeaf(5, 19, 5, 3, false)}
      {px(2, 19, 1, 4, C.aerial)}
      {px(1, 22, 2, 1, C.aerialDark)}
      {/* vara floral arqueada */}
      {px(10, 15, 1, 4, C.spike)}
      {px(11, 11, 1, 4, C.spike)}
      {px(12,  8, 1, 3, C.spike)}
      {px(13,  6, 2, 2, C.spike)}
      {OrchidBud(14, 3, 1)}
      {OrchidBud(12, 5, 1)}
    </>
  );
}

export function OrchidStage5() {
  return (
    <>
      <Pot />
      {OrchidLeaf(3, 16, 7, 5, false)}
      {OrchidLeaf(10,17, 7, 4, true)}
      {OrchidLeaf(4, 19, 6, 3, false)}
      {px(2, 18, 1, 5, C.aerial)}
      {px(17,20, 1, 4, C.aerial)}
      {/* vara floral con 3 capullos */}
      {px(10, 15, 1, 4, C.spike)}
      {px(11, 11, 1, 4, C.spike)}
      {px(12,  7, 1, 4, C.spike)}
      {px(13,  5, 2, 2, C.spike)}
      {OrchidBud(14, 1, 2)}
      {OrchidBud(12, 4, 1)}
      {OrchidBud(10, 7, 1)}
    </>
  );
}

export function OrchidStage6() {
  return (
    <>
      <Pot />
      {OrchidLeaf(2, 16, 8, 5, false)}
      {OrchidLeaf(10,17, 8, 4, true)}
      {OrchidLeaf(4, 19, 6, 3, false)}
      {px(1, 18, 1, 5, C.aerial)}
      {px(18,19, 1, 5, C.aerial)}
      {/* vara floral */}
      {px(10, 15, 1, 4, C.spike)}
      {px(11, 11, 1, 4, C.spike)}
      {px(12,  7, 1, 4, C.spike)}
      {px(13,  5, 2, 2, C.spike)}
      {/* primera flor abierta + capullos */}
      {OrchidFlower(14, 4)}
      {OrchidBud(11, 6, 1)}
      {OrchidBud(9,  9, 1)}
    </>
  );
}

export function OrchidStage7() {
  return (
    <>
      <Pot />
      {OrchidLeaf(2, 16, 8, 5, false)}
      {OrchidLeaf(10,17, 8, 4, true)}
      {OrchidLeaf(3, 20, 7, 3, false)}
      {px(1, 17, 1, 6, C.aerial)}
      {px(18,18, 1, 6, C.aerial)}
      {/* vara curvada */}
      {px(10, 15, 1, 4, C.spike)}
      {px(11, 10, 1, 5, C.spike)}
      {px(12,  6, 2, 4, C.spike)}
      {px(13,  4, 2, 2, C.spike)}
      {/* dos flores abiertas + 1 capullo */}
      {OrchidFlower(14, 3)}
      {OrchidFlower(11, 9)}
      {OrchidBud(9, 12, 1)}
    </>
  );
}

export function OrchidStage8() {
  return (
    <>
      <Pot />
      {OrchidLeaf(1, 16, 9, 5, false)}
      {OrchidLeaf(10,17, 9, 4, true)}
      {OrchidLeaf(3, 20, 7, 3, false)}
      {px(0, 17, 1, 7, C.aerial)}
      {px(19,18, 1, 6, C.aerial)}
      {px(18,16, 1, 3, C.aerial)}
      {/* vara floral completa */}
      {px(10, 15, 1, 4, C.spike)}
      {px(11, 10, 1, 5, C.spike)}
      {px(12,  5, 2, 5, C.spike)}
      {px(13,  3, 3, 2, C.spike)}
      {/* tres flores abiertas en cascada */}
      {OrchidFlower(14, 1)}
      {OrchidFlower(13, 7)}
      {OrchidFlower(11, 12)}
    </>
  );
}
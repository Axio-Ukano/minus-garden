// ── Cactus palette ────────────────────────────────────────────────────────────
const C = {
  soil: "#6b4e38",
  soilDark: "#4a3326",
  pot: "#c8956a",
  potMid: "#b07850",
  potDark: "#3d2b1f",
  potShine: "#e0b48a",
  bodyDark: "#1e5c28",
  bodyMid: "#2d7a3a",
  bodyLight: "#3a9a48",
  bodyShine: "#58c060",
  ribLine: "#174d20",
  ribHi: "#4ab858",
  spine: "#d4e8b0",
  spineTip: "#f0f8e0",
  armDark: "#1a5022",
  armMid: "#2a6e32",
  armLight: "#3a8a42",
  flowerPink: "#e84090",
  flowerPinkLight: "#f870b8",
  flowerPinkDark: "#b02868",
  flowerYellow: "#f5c842",
  flowerWhite: "#fff4e8",
  stamen: "#f8e840",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(2,  20, 14, 1, C.potShine)}
      {px(3,  20, 12, 1, C.pot)}
      {px(2,  20, 1,  1, C.potDark)}
      {px(15, 20, 1,  1, C.potDark)}
      {px(3,  21, 12, 3, C.pot)}
      {px(3,  21, 1,  3, C.potDark)}
      {px(14, 21, 1,  3, C.potDark)}
      {px(4,  21, 4,  3, C.potMid)}
      {px(3,  23, 12, 1, C.potDark)}
      {px(2,  24, 14, 1, C.soil)}
      {px(4,  24, 2,  1, C.soilDark)}
      {px(11, 24, 2,  1, C.soilDark)}
    </>
  );
}

// Cuerpo barril con costillas y brillo
function Barrel(x: number, y: number, w: number, h: number) {
  const mid = Math.floor(x + w / 2);
  return (
    <>
      {px(x,       y,     w,     h,     C.bodyMid)}
      {px(x,       y,     1,     h,     C.ribLine)}
      {px(x+w-1,   y,     1,     h,     C.ribLine)}
      {px(mid-1,   y,     2,     h,     C.ribLine)}
      {px(x+1,     y,     2,     h,     C.bodyLight)}
      {px(x+1,     y,     1,     2,     C.bodyShine)}
      {px(x,       y,     w,     1,     C.bodyLight)}
    </>
  );
}

function SpineRow(y: number, xl: number, xr: number) {
  return (
    <>
      {px(xl-1, y, 2, 1, C.spine)}
      {px(xl-2, y, 1, 1, C.spineTip)}
      {px(xr,   y, 2, 1, C.spine)}
      {px(xr+2, y, 1, 1, C.spineTip)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function CactusStage1() {
  return (
    <>
      <Pot />
      {px(8, 19, 2, 1, C.bodyLight)}
      {px(7, 18, 4, 2, C.bodyMid)}
      {px(8, 18, 2, 2, C.bodyLight)}
      {px(7, 18, 1, 2, C.ribLine)}
      {px(10,18, 1, 2, C.ribLine)}
    </>
  );
}

export function CactusStage2() {
  return (
    <>
      <Pot />
      {Barrel(6, 14, 6, 6)}
      {SpineRow(15, 6, 11)}
      {SpineRow(18, 6, 11)}
    </>
  );
}

export function CactusStage3() {
  return (
    <>
      <Pot />
      {Barrel(6, 10, 6, 10)}
      {SpineRow(11, 6, 11)}
      {SpineRow(14, 6, 11)}
      {SpineRow(17, 6, 11)}
    </>
  );
}

export function CactusStage4() {
  // Cuerpo alto + brazos cortos horizontales
  return (
    <>
      <Pot />
      {Barrel(6, 7, 6, 13)}
      {SpineRow(8,  6, 11)}
      {SpineRow(11, 6, 11)}
      {SpineRow(14, 6, 11)}
      {SpineRow(17, 6, 11)}
      {/* brazo izquierdo horizontal */}
      {px(2, 12, 4, 3, C.armMid)}
      {px(2, 12, 1, 3, C.armDark)}
      {px(2, 12, 4, 1, C.armLight)}
      {px(3, 12, 1, 3, C.ribLine)}
      {/* brazo derecho horizontal */}
      {px(12,12, 4, 3, C.armMid)}
      {px(15,12, 1, 3, C.armDark)}
      {px(12,12, 4, 1, C.armLight)}
      {px(14,12, 1, 3, C.ribLine)}
      {/* espinas brazos */}
      {px(1, 13, 1, 1, C.spineTip)}
      {px(16,13, 1, 1, C.spineTip)}
    </>
  );
}

export function CactusStage5() {
  // Saguaro completo — brazos suben
  return (
    <>
      <Pot />
      {Barrel(6, 6, 6, 14)}
      {SpineRow(7,  6, 11)}
      {SpineRow(10, 6, 11)}
      {SpineRow(13, 6, 11)}
      {SpineRow(16, 6, 11)}
      {/* brazo izquierdo: horizontal luego sube */}
      {px(2, 13, 4, 3, C.armMid)}
      {px(2, 13, 1, 3, C.armDark)}
      {px(2, 13, 4, 1, C.armLight)}
      {px(3, 13, 1, 3, C.ribLine)}
      {px(2,  9, 3, 4, C.armMid)}
      {px(2,  9, 1, 4, C.armDark)}
      {px(2,  9, 3, 1, C.armLight)}
      {px(3, 10, 1, 3, C.ribLine)}
      {/* brazo derecho: horizontal luego sube */}
      {px(12,13, 4, 3, C.armMid)}
      {px(15,13, 1, 3, C.armDark)}
      {px(12,13, 4, 1, C.armLight)}
      {px(14,13, 1, 3, C.ribLine)}
      {px(13, 9, 3, 4, C.armMid)}
      {px(15, 9, 1, 4, C.armDark)}
      {px(13, 9, 3, 1, C.armLight)}
      {px(14,10, 1, 3, C.ribLine)}
      {/* espinas brazos */}
      {px(1, 14, 1, 1, C.spineTip)}
      {px(16,14, 1, 1, C.spineTip)}
      {px(1,  9, 1, 1, C.spineTip)}
      {px(16, 9, 1, 1, C.spineTip)}
    </>
  );
}

export function CactusStage6() {
  // Saguaro pleno + corona de flores
  return (
    <>
      <Pot />
      {Barrel(6, 6, 6, 14)}
      {SpineRow(7,  6, 11)}
      {SpineRow(10, 6, 11)}
      {SpineRow(13, 6, 11)}
      {SpineRow(16, 6, 11)}
      {/* brazos */}
      {px(2, 13, 4, 3, C.armMid)}
      {px(2, 13, 1, 3, C.armDark)}
      {px(2, 13, 4, 1, C.armLight)}
      {px(3, 13, 1, 3, C.ribLine)}
      {px(2,  9, 3, 4, C.armMid)}
      {px(2,  9, 1, 4, C.armDark)}
      {px(2,  9, 3, 1, C.armLight)}
      {px(3, 10, 1, 3, C.ribLine)}
      {px(12,13, 4, 3, C.armMid)}
      {px(15,13, 1, 3, C.armDark)}
      {px(12,13, 4, 1, C.armLight)}
      {px(14,13, 1, 3, C.ribLine)}
      {px(13, 9, 3, 4, C.armMid)}
      {px(15, 9, 1, 4, C.armDark)}
      {px(13, 9, 3, 1, C.armLight)}
      {px(14,10, 1, 3, C.ribLine)}
      {px(1, 14, 1, 1, C.spineTip)}
      {px(16,14, 1, 1, C.spineTip)}
      {px(1,  9, 1, 1, C.spineTip)}
      {px(16, 9, 1, 1, C.spineTip)}
      {/* corona de flores — 3 flores en lo alto */}
      {/* flor central */}
      {px(8,  1, 2, 2, C.flowerPinkLight)}
      {px(7,  2, 4, 2, C.flowerPink)}
      {px(7,  2, 1, 2, C.flowerPinkDark)}
      {px(10, 2, 1, 2, C.flowerPinkDark)}
      {px(8,  3, 2, 1, C.flowerYellow)}
      {px(8,  4, 2, 1, C.stamen)}
      {/* flor izquierda */}
      {px(5,  3, 2, 2, C.flowerPink)}
      {px(5,  4, 2, 1, C.flowerYellow)}
      {/* flor derecha */}
      {px(11, 3, 2, 2, C.flowerPink)}
      {px(11, 4, 2, 1, C.flowerYellow)}
    </>
  );
}
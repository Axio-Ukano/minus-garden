// ── Daisy palette ────────────────────────────────────────────────────────────
const C = {
  soil: "#6b4e38",
  soilDark: "#4a3326",
  pot: "#c8956a",
  potMid: "#b07850",
  potDark: "#3d2b1f",
  potShine: "#e0b48a",
  stem: "#5a8a3c",
  stemDark: "#3d6b28",
  stemLight: "#7ab648",
  leaf: "#4a7a30",
  leafLight: "#6aaa48",
  leafDark: "#2d5a1a",
  budGreen: "#7ab648",
  budDark: "#4a7a30",
  petalWhite: "#fff8f0",
  petalCream: "#ffe8d0",
  petalPink: "#f0b8c8",
  petalPinkDark: "#d890a8",
  center: "#f5c842",
  centerDark: "#d4a020",
  centerSpeck: "#c87820",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

// ── Shared parts ─────────────────────────────────────────────────────────────
function Pot() {
  return (
    <>
      {/* rim */}
      {px(2, 17, 12, 1, C.potShine)}
      {px(3, 17, 10, 1, C.pot)}
      {px(2, 17, 1, 1, C.potDark)}
      {px(13, 17, 1, 1, C.potDark)}
      {/* body */}
      {px(3, 18, 10, 3, C.pot)}
      {px(3, 18, 1, 3, C.potDark)}
      {px(12, 18, 1, 3, C.potDark)}
      {px(4, 18, 3, 3, C.potMid)}
      {px(3, 20, 10, 1, C.potDark)}
      {/* soil */}
      {px(2, 21, 12, 1, C.soil)}
      {px(4, 21, 2, 1, C.soilDark)}
      {px(9, 21, 2, 1, C.soilDark)}
    </>
  );
}

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 16; row++) {
    rects.push(px(7, row, 2, 1, row % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function DaisyStage1() {
  // Semilla recién germinada — nubito verde saliendo del macetero
  return (
    <>
      <Pot />
      {px(7, 16, 2, 1, C.stem)}
      {px(6, 15, 4, 1, C.budGreen)}
      {px(7, 15, 2, 1, C.budDark)}
    </>
  );
}

export function DaisyStage2() {
  // Brote con dos cotiledones pequeños
  return (
    <>
      <Pot />
      {px(7, 13, 2, 4, C.stem)}
      {/* cotiledones */}
      {px(4, 14, 3, 2, C.leafLight)}
      {px(4, 14, 1, 2, C.leafDark)}
      {px(9, 14, 3, 2, C.leafLight)}
      {px(11, 14, 1, 2, C.leafDark)}
    </>
  );
}

export function DaisyStage3() {
  // Tallo largo con dos hojas verdaderas y forma definida
  return (
    <>
      <Pot />
      {Stem(9)}
      {/* hoja izquierda */}
      {px(3, 12, 4, 2, C.leaf)}
      {px(3, 12, 1, 2, C.leafDark)}
      {px(5, 12, 2, 1, C.leafLight)}
      {/* hoja derecha */}
      {px(9, 11, 4, 2, C.leaf)}
      {px(12, 11, 1, 2, C.leafDark)}
      {px(9, 11, 2, 1, C.leafLight)}
    </>
  );
}

export function DaisyStage4() {
  // Capullo apretado en lo alto del tallo
  return (
    <>
      <Pot />
      {Stem(8)}
      {/* hojas */}
      {px(3, 12, 4, 2, C.leaf)}
      {px(3, 12, 1, 2, C.leafDark)}
      {px(5, 12, 2, 1, C.leafLight)}
      {px(9, 11, 4, 2, C.leaf)}
      {px(12, 11, 1, 2, C.leafDark)}
      {px(9, 11, 2, 1, C.leafLight)}
      {/* capullo */}
      {px(6, 5, 4, 3, C.budGreen)}
      {px(6, 5, 1, 3, C.budDark)}
      {px(9, 5, 1, 3, C.budDark)}
      {px(7, 4, 2, 1, C.budGreen)}
      {px(6, 7, 4, 1, C.budDark)}
      {/* punta del pétalo asomándose */}
      {px(7, 3, 2, 1, C.petalCream)}
    </>
  );
}

export function DaisyStage5() {
  // Flor abierta completa — pétalos en cruz con diagonales
  return (
    <>
      <Pot />
      {Stem(8)}
      {/* hojas */}
      {px(3, 12, 4, 2, C.leaf)}
      {px(3, 12, 1, 2, C.leafDark)}
      {px(5, 12, 2, 1, C.leafLight)}
      {px(9, 11, 4, 2, C.leaf)}
      {px(12, 11, 1, 2, C.leafDark)}
      {px(9, 11, 2, 1, C.leafLight)}
      {/* pétalos superiores */}
      {px(6, 0, 4, 2, C.petalWhite)}
      {px(7, 0, 2, 2, C.petalCream)}
      {/* pétalos inferiores */}
      {px(6, 7, 4, 2, C.petalWhite)}
      {px(7, 7, 2, 1, C.petalCream)}
      {/* pétalos izquierdo */}
      {px(2, 3, 2, 2, C.petalWhite)}
      {px(3, 3, 2, 1, C.petalCream)}
      {px(4, 2, 2, 1, C.petalPink)}
      {px(4, 5, 2, 1, C.petalPink)}
      {/* pétalos derecho */}
      {px(12, 3, 2, 2, C.petalWhite)}
      {px(11, 3, 2, 1, C.petalCream)}
      {px(10, 2, 2, 1, C.petalPink)}
      {px(10, 5, 2, 1, C.petalPink)}
      {/* diagonales */}
      {px(4, 1, 2, 2, C.petalWhite)}
      {px(10, 1, 2, 2, C.petalWhite)}
      {px(4, 5, 2, 2, C.petalWhite)}
      {px(10, 5, 2, 2, C.petalWhite)}
      {/* centro */}
      {px(6, 2, 4, 4, C.center)}
      {px(7, 2, 2, 1, C.centerSpeck)}
      {px(6, 4, 1, 1, C.centerDark)}
      {px(9, 4, 1, 1, C.centerDark)}
      {px(7, 5, 2, 1, C.centerDark)}
    </>
  );
}

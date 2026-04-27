// ── Sunflower palette ─────────────────────────────────────────────────────────
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
  leafVein: "#3d6b28",
  budGreen: "#7ab648",
  budDark: "#4a7a30",
  petalOuter: "#f5c842",
  petalMid: "#e8a820",
  petalInner: "#d48010",
  petalTip: "#fde06a",
  center: "#5a2e0a",
  centerMid: "#7a4218",
  centerHi: "#9a5a28",
  centerSpeck: "#3a1a06",
  diskRay: "#8b5a20",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

// ── Shared parts ─────────────────────────────────────────────────────────────
function Pot() {
  return (
    <>
      {px(3, 22, 14, 1, C.potShine)}
      {px(4, 22, 12, 1, C.pot)}
      {px(3, 22, 1, 1, C.potDark)}
      {px(16, 22, 1, 1, C.potDark)}
      {px(4, 23, 12, 3, C.pot)}
      {px(4, 23, 1, 3, C.potDark)}
      {px(15, 23, 1, 3, C.potDark)}
      {px(5, 23, 4, 3, C.potMid)}
      {px(4, 25, 12, 1, C.potDark)}
      {px(3, 26, 14, 1, C.soil)}
      {px(5, 26, 2, 1, C.soilDark)}
      {px(12, 26, 2, 1, C.soilDark)}
    </>
  );
}

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 21; row++) {
    const shade = row % 4 === 0 ? C.stemDark : row % 4 === 1 ? C.stemLight : C.stem;
    rects.push(px(9, row, 2, 1, shade));
  }
  return <>{rects}</>;
}

function BigLeafLeft(y: number) {
  return (
    <>
      {px(3, y, 5, 3, C.leaf)}
      {px(3, y, 1, 3, C.leafDark)}
      {px(4, y, 5, 1, C.leafLight)}
      {px(5, y + 1, 3, 1, C.leafVein)}
      {px(3, y + 2, 5, 1, C.leafDark)}
    </>
  );
}

function BigLeafRight(y: number) {
  return (
    <>
      {px(12, y, 5, 3, C.leaf)}
      {px(16, y, 1, 3, C.leafDark)}
      {px(12, y, 5, 1, C.leafLight)}
      {px(12, y + 1, 3, 1, C.leafVein)}
      {px(12, y + 2, 5, 1, C.leafDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function SunflowerStage1() {
  return (
    <>
      <Pot />
      {px(9, 21, 2, 1, C.stem)}
      {px(8, 20, 4, 1, C.budGreen)}
      {px(9, 20, 2, 1, C.budDark)}
    </>
  );
}

export function SunflowerStage2() {
  return (
    <>
      <Pot />
      {px(9, 18, 2, 4, C.stem)}
      {px(6, 19, 3, 2, C.leafLight)}
      {px(6, 19, 1, 2, C.leafDark)}
      {px(11, 19, 3, 2, C.leafLight)}
      {px(13, 19, 1, 2, C.leafDark)}
    </>
  );
}

export function SunflowerStage3() {
  return (
    <>
      <Pot />
      {Stem(15)}
      {BigLeafLeft(17)}
      {BigLeafRight(15)}
    </>
  );
}

export function SunflowerStage4() {
  return (
    <>
      <Pot />
      {Stem(12)}
      {BigLeafLeft(17)}
      {BigLeafRight(15)}
      {/* capullo inclinado */}
      {px(8, 8, 4, 4, C.budGreen)}
      {px(8, 8, 1, 4, C.budDark)}
      {px(11, 8, 1, 4, C.budDark)}
      {px(9, 7, 2, 1, C.budGreen)}
      {px(8, 11, 4, 1, C.budDark)}
      {px(9, 6, 2, 1, C.leafLight)}
    </>
  );
}

export function SunflowerStage5() {
  return (
    <>
      <Pot />
      {Stem(12)}
      {BigLeafLeft(17)}
      {BigLeafRight(15)}
      {/* capullo abriéndose */}
      {px(7, 6, 6, 5, C.budGreen)}
      {px(7, 6, 1, 5, C.budDark)}
      {px(12, 6, 1, 5, C.budDark)}
      {px(8, 5, 4, 1, C.budGreen)}
      {px(7, 10, 6, 1, C.budDark)}
      {/* primeros pétalos asomando */}
      {px(6, 5, 2, 2, C.petalOuter)}
      {px(12, 5, 2, 2, C.petalOuter)}
      {px(8, 3, 4, 2, C.petalOuter)}
    </>
  );
}

export function SunflowerStage6() {
  return (
    <>
      <Pot />
      {Stem(13)}
      {BigLeafLeft(17)}
      {BigLeafRight(15)}
      {/* pétalos exteriores */}
      {px(6, 1, 8, 2, C.petalOuter)}
      {px(5, 2, 2, 2, C.petalOuter)}
      {px(13, 2, 2, 2, C.petalOuter)}
      {px(4, 4, 2, 2, C.petalMid)}
      {px(14, 4, 2, 2, C.petalMid)}
      {px(6, 9, 8, 2, C.petalOuter)}
      {px(5, 8, 2, 2, C.petalOuter)}
      {px(13, 8, 2, 2, C.petalOuter)}
      {px(4, 7, 2, 2, C.petalMid)}
      {px(14, 7, 2, 2, C.petalMid)}
      {/* centro */}
      {px(6, 3, 8, 6, C.center)}
      {px(7, 3, 6, 1, C.centerMid)}
      {px(6, 4, 1, 4, C.centerMid)}
      {px(7, 5, 2, 2, C.centerHi)}
    </>
  );
}

export function SunflowerStage7() {
  return (
    <>
      <Pot />
      {Stem(13)}
      {BigLeafLeft(18)}
      {BigLeafRight(16)}
      {/* pétalos completos, flor grande y madura */}
      {/* anillo exterior */}
      {px(6, 0, 8, 2, C.petalOuter)}
      {px(5, 1, 2, 2, C.petalTip)}
      {px(13, 1, 2, 2, C.petalTip)}
      {px(3, 3, 3, 2, C.petalOuter)}
      {px(14, 3, 3, 2, C.petalOuter)}
      {px(3, 7, 3, 2, C.petalOuter)}
      {px(14, 7, 3, 2, C.petalOuter)}
      {px(5, 10, 2, 2, C.petalTip)}
      {px(13, 10, 2, 2, C.petalTip)}
      {px(6, 11, 8, 2, C.petalOuter)}
      {/* anillo interior */}
      {px(6, 2, 8, 1, C.petalMid)}
      {px(5, 3, 2, 1, C.petalMid)}
      {px(13, 3, 2, 1, C.petalMid)}
      {px(4, 4, 2, 4, C.petalMid)}
      {px(14, 4, 2, 4, C.petalMid)}
      {px(5, 9, 2, 1, C.petalMid)}
      {px(13, 9, 2, 1, C.petalMid)}
      {px(6, 10, 8, 1, C.petalMid)}
      {/* detalles pétalos inferiores */}
      {px(5, 4, 1, 1, C.petalInner)}
      {px(14, 4, 1, 1, C.petalInner)}
      {px(5, 8, 1, 1, C.petalInner)}
      {px(14, 8, 1, 1, C.petalInner)}
      {/* disco central */}
      {px(6, 3, 8, 8, C.center)}
      {px(7, 3, 6, 1, C.centerMid)}
      {px(6, 4, 1, 6, C.centerMid)}
      {px(13, 4, 1, 5, C.centerSpeck)}
      {px(6, 10, 8, 1, C.centerSpeck)}
      {px(7, 4, 2, 2, C.centerHi)}
      {px(9, 5, 1, 1, C.centerHi)}
      {px(10, 7, 1, 1, C.diskRay)}
      {px(8, 8, 1, 1, C.diskRay)}
      {px(11, 4, 1, 1, C.diskRay)}
    </>
  );
}

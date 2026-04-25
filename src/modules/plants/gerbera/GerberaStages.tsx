// ── Gerbera palette ───────────────────────────────────────────────────────────
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
  leafVein: "#3a6028",
  budGreen: "#7ab648",
  budDark: "#4a7a30",
  petalOrange: "#f07030",
  petalOrangeMid: "#e85020",
  petalOrangeLight: "#f89060",
  petalOrangeTip: "#fbb080",
  petalRed: "#c02020",
  centerYellow: "#f8c830",
  centerDark: "#c89010",
  centerSpeck: "#a07010",
  centerGreen: "#508030",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(2,  17, 14, 1, C.potShine)}
      {px(3,  17, 12, 1, C.pot)}
      {px(2,  17, 1,  1, C.potDark)}
      {px(15, 17, 1,  1, C.potDark)}
      {px(3,  18, 12, 3, C.pot)}
      {px(3,  18, 1,  3, C.potDark)}
      {px(14, 18, 1,  3, C.potDark)}
      {px(4,  18, 4,  3, C.potMid)}
      {px(3,  20, 12, 1, C.potDark)}
      {px(2,  21, 14, 1, C.soil)}
      {px(4,  21, 2,  1, C.soilDark)}
      {px(11, 21, 2,  1, C.soilDark)}
    </>
  );
}

function Stem(topRow: number) {
  const rects = [];
  for (let row = topRow; row <= 16; row++) {
    rects.push(px(8, row, 2, 1, row % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

function Leaf(x: number, y: number, w: number, h: number, flip: boolean) {
  return (
    <>
      {px(x, y, w, h, C.leaf)}
      {px(flip ? x+w-1 : x, y, 1, h, C.leafDark)}
      {px(x, y, w, 1, C.leafLight)}
      {px(flip ? x : x+1, y+1, w-1, 1, C.leafVein)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function GerberaStage1() {
  return (
    <>
      <Pot />
      {px(8, 16, 2, 1, C.stem)}
      {px(7, 15, 4, 1, C.budGreen)}
      {px(8, 15, 2, 1, C.budDark)}
    </>
  );
}

export function GerberaStage2() {
  return (
    <>
      <Pot />
      {px(8, 13, 2, 4, C.stem)}
      {Leaf(4, 14, 4, 2, false)}
      {Leaf(10,14, 4, 2, true)}
    </>
  );
}

export function GerberaStage3() {
  return (
    <>
      <Pot />
      {Stem(10)}
      {Leaf(3, 14, 5, 3, false)}
      {Leaf(10,13, 5, 3, true)}
      {/* capullo verde con punta anaranjada */}
      {px(7,  6, 4, 4, C.budGreen)}
      {px(7,  6, 1, 4, C.budDark)}
      {px(10, 6, 1, 4, C.budDark)}
      {px(8,  5, 2, 1, C.budGreen)}
      {px(7,  9, 4, 1, C.budDark)}
      {px(8,  4, 2, 2, C.petalOrangeTip)}
    </>
  );
}

export function GerberaStage4() {
  return (
    <>
      <Pot />
      {Stem(10)}
      {Leaf(3, 14, 5, 3, false)}
      {Leaf(10,13, 5, 3, true)}
      {/* pétalos abriendo — 8 pétalos planos */}
      {px(6,  1, 6, 2, C.petalOrangeLight)}
      {px(6,  8, 6, 2, C.petalOrangeLight)}
      {px(2,  4, 3, 2, C.petalOrange)}
      {px(13, 4, 3, 2, C.petalOrange)}
      {px(2,  6, 3, 2, C.petalOrange)}
      {px(13, 6, 3, 2, C.petalOrange)}
      {px(4,  2, 2, 2, C.petalOrangeMid)}
      {px(12, 2, 2, 2, C.petalOrangeMid)}
      {px(4,  8, 2, 2, C.petalOrangeMid)}
      {px(12, 8, 2, 2, C.petalOrangeMid)}
      {/* centro con disco */}
      {px(6,  3, 6, 5, C.centerYellow)}
      {px(7,  3, 4, 1, C.centerDark)}
      {px(6,  4, 1, 3, C.centerDark)}
      {px(11, 4, 1, 3, C.centerDark)}
      {px(7,  5, 2, 2, C.centerSpeck)}
    </>
  );
}

export function GerberaStage5() {
  return (
    <>
      <Pot />
      {Stem(10)}
      {Leaf(3, 15, 5, 3, false)}
      {Leaf(10,14, 5, 3, true)}
      {/* pétalos completos — doble fila, flor grande */}
      {/* fila exterior */}
      {px(5,  0, 8, 2, C.petalOrangeLight)}
      {px(5,  9, 8, 2, C.petalOrangeLight)}
      {px(1,  3, 3, 4, C.petalOrangeLight)}
      {px(14, 3, 3, 4, C.petalOrangeLight)}
      {/* esquinas diagonales */}
      {px(3,  1, 3, 2, C.petalOrange)}
      {px(12, 1, 3, 2, C.petalOrange)}
      {px(3,  8, 3, 2, C.petalOrange)}
      {px(12, 8, 3, 2, C.petalOrange)}
      {/* fila interior */}
      {px(6,  1, 6, 1, C.petalOrangeMid)}
      {px(6,  9, 6, 1, C.petalOrangeMid)}
      {px(2,  4, 2, 3, C.petalOrangeMid)}
      {px(14, 4, 2, 3, C.petalOrangeMid)}
      {/* tips rojos */}
      {px(7,  0, 4, 1, C.petalRed)}
      {px(7, 10, 4, 1, C.petalRed)}
      {px(1,  4, 1, 3, C.petalRed)}
      {px(16, 4, 1, 3, C.petalRed)}
      {/* disco central amarillo oscuro */}
      {px(5,  2, 8, 7, C.centerYellow)}
      {px(6,  2, 6, 1, C.centerDark)}
      {px(5,  3, 1, 5, C.centerDark)}
      {px(12, 3, 1, 4, C.centerDark)}
      {px(5,  8, 8, 1, C.centerDark)}
      {px(7,  4, 3, 3, C.centerSpeck)}
      {px(8,  5, 2, 1, C.centerGreen)}
    </>
  );
}
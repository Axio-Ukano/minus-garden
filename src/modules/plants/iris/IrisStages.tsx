// ── Iris palette ──────────────────────────────────────────────────────────────
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
  leaf: "#4a7830",
  leafLight: "#6aa048",
  leafDark: "#2d5520",
  leafRidge: "#3a6528",
  sheath: "#608840",
  sheathDark: "#406028",
  petalPurple: "#6040b0",
  petalPurpleMid: "#8060d0",
  petalPurpleLight: "#a080f0",
  petalPurpleTip: "#c0a0ff",
  petalFall: "#4828a0",
  petalFallDark: "#301880",
  beard: "#f8c040",
  beardTip: "#fce880",
  veins: "#7850c0",
  center: "#9070d8",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(2, 21, 12, 1, C.potShine)}
      {px(3, 21, 10, 1, C.pot)}
      {px(2, 21, 1, 1, C.potDark)}
      {px(13, 21, 1, 1, C.potDark)}
      {px(3, 22, 10, 3, C.pot)}
      {px(3, 22, 1, 3, C.potDark)}
      {px(12, 22, 1, 3, C.potDark)}
      {px(4, 22, 3, 3, C.potMid)}
      {px(3, 24, 10, 1, C.potDark)}
      {px(2, 25, 12, 1, C.soil)}
      {px(4, 25, 2, 1, C.soilDark)}
      {px(9, 25, 2, 1, C.soilDark)}
    </>
  );
}

// Hoja de iris — larga, puntiaguda y con nervio central
function IrisLeaf(x: number, topY: number, height: number, flip: boolean) {
  const rects = [];
  for (let i = 0; i < height; i++) {
    const y = topY + i;
    const wide = i < height * 0.6 ? 2 : 3;
    rects.push(px(flip ? x - wide + 1 : x, y, wide, 1, i % 4 === 0 ? C.leafLight : C.leaf));
    if (wide > 2) {
      rects.push(px(flip ? x : x + wide - 1, y, 1, 1, C.leafDark));
    }
    rects.push(px(flip ? x - 1 : x + wide, y, 1, 1, C.leafRidge));
  }
  return <>{rects}</>;
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function IrisStage1() {
  return (
    <>
      <Pot />
      {px(7, 20, 2, 1, C.stem)}
      {px(6, 19, 4, 1, C.stemLight)}
      {px(7, 19, 2, 1, C.stem)}
    </>
  );
}

export function IrisStage2() {
  return (
    <>
      <Pot />
      {/* dos hojas de iris jóvenes */}
      {IrisLeaf(6, 13, 8, false)}
      {IrisLeaf(8, 14, 7, true)}
    </>
  );
}

export function IrisStage3() {
  return (
    <>
      <Pot />
      {/* hojas más maduras, más altas */}
      {IrisLeaf(4, 8, 13, false)}
      {IrisLeaf(9, 9, 12, true)}
      {IrisLeaf(6, 11, 10, false)}
    </>
  );
}

export function IrisStage4() {
  return (
    <>
      <Pot />
      {IrisLeaf(4, 8, 13, false)}
      {IrisLeaf(9, 9, 12, true)}
      {IrisLeaf(6, 11, 10, false)}
      {/* tallo floral con espata */}
      {px(7, 5, 2, 7, C.stem)}
      {px(6, 8, 1, 2, C.sheath)}
      {px(9, 7, 1, 3, C.sheathDark)}
      {/* capullo apretado */}
      {px(6, 2, 4, 3, C.petalPurple)}
      {px(6, 2, 1, 3, C.petalFallDark)}
      {px(9, 2, 1, 3, C.petalFallDark)}
      {px(7, 1, 2, 1, C.petalPurpleMid)}
      {px(6, 4, 4, 1, C.petalFallDark)}
    </>
  );
}

export function IrisStage5() {
  return (
    <>
      <Pot />
      {IrisLeaf(3, 8, 13, false)}
      {IrisLeaf(10, 9, 12, true)}
      {IrisLeaf(6, 11, 10, false)}
      {px(7, 6, 2, 6, C.stem)}
      {px(6, 9, 1, 2, C.sheath)}
      {px(9, 8, 1, 3, C.sheathDark)}
      {/* pétalos estándar (falls) cayendo */}
      {px(4, 8, 3, 2, C.petalFall)}
      {px(4, 8, 1, 2, C.petalFallDark)}
      {px(11, 8, 3, 2, C.petalFall)}
      {px(13, 8, 1, 2, C.petalFallDark)}
      {/* pétalos estándar (standards) erigidos */}
      {px(5, 2, 6, 4, C.petalPurpleLight)}
      {px(5, 2, 1, 4, C.petalPurple)}
      {px(10, 2, 1, 4, C.petalPurple)}
      {px(6, 1, 4, 1, C.petalPurpleTip)}
      {/* barba */}
      {px(6, 9, 3, 1, C.beard)}
      {px(9, 9, 3, 1, C.beard)}
      {px(7, 9, 1, 1, C.beardTip)}
    </>
  );
}

export function IrisStage6() {
  return (
    <>
      <Pot />
      {IrisLeaf(3, 8, 13, false)}
      {IrisLeaf(10, 9, 12, true)}
      {IrisLeaf(5, 10, 11, false)}
      {IrisLeaf(8, 11, 10, true)}
      {px(7, 6, 2, 6, C.stem)}
      {px(6, 9, 1, 2, C.sheath)}
      {px(9, 8, 1, 3, C.sheathDark)}
      {/* falls completos con venas */}
      {px(3, 7, 4, 3, C.petalFall)}
      {px(3, 7, 1, 3, C.petalFallDark)}
      {px(4, 9, 3, 1, C.petalFallDark)}
      {px(11, 7, 4, 3, C.petalFall)}
      {px(14, 7, 1, 3, C.petalFallDark)}
      {px(11, 9, 3, 1, C.petalFallDark)}
      {px(4, 8, 2, 1, C.veins)}
      {px(12, 8, 2, 1, C.veins)}
      {/* standards amplios con degradé */}
      {px(4, 0, 8, 6, C.petalPurpleLight)}
      {px(4, 0, 1, 6, C.petalPurple)}
      {px(11, 0, 1, 6, C.petalPurple)}
      {px(5, 0, 6, 1, C.petalPurpleTip)}
      {px(5, 1, 6, 2, C.petalPurpleMid)}
      {px(6, 3, 4, 2, C.center)}
      {/* barba prominente */}
      {px(5, 8, 4, 2, C.beard)}
      {px(9, 8, 4, 2, C.beard)}
      {px(6, 8, 1, 1, C.beardTip)}
      {px(10, 8, 1, 1, C.beardTip)}
    </>
  );
}

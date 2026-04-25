// ── Cactus palette ───────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  bodyDark: "#2d7a3a",
  bodyMid: "#3a9a48",
  bodyLight: "#5ab858",
  spine: "#1f4d1a",
  spineHighlight: "#2d6b22",
  flowerPink: "#e85fa3",
  flowerYellow: "#f5c842",
  flowerWhite: "#fff8f0",
  ribLine: "#246030",
} as const;

type Color = (typeof C)[keyof typeof C];

function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={fill} />;
}

function Pot() {
  return (
    <>
      {px(4, 11, 8, 3, C.pot)}
      {px(3, 10, 10, 1, C.pot)}
      {px(3, 10, 10, 1, C.potBorder)}
      {px(4, 11, 1, 3, C.potBorder)}
      {px(11, 11, 1, 3, C.potBorder)}
      {px(4, 13, 8, 1, C.potBorder)}
      {px(2, 14, 12, 1, C.soil)}
    </>
  );
}

// Barrel body: wide (6px), flat top with 1px corner cut for roundness
function BarrelBody(y: number, h: number) {
  return (
    <>
      {/* body fill */}
      {px(5, y + 1, 6, h - 1, C.bodyMid)}
      {/* top row — inset 1px each side for rounded look */}
      {px(6, y, 4, 1, C.bodyMid)}
      {/* left highlight strip */}
      {px(6, y, 2, h, C.bodyLight)}
      {/* rib lines */}
      {px(5, y + 1, 1, h - 1, C.ribLine)}
      {px(10, y + 1, 1, h - 1, C.ribLine)}
      {px(8, y, 1, h, C.ribLine)}
    </>
  );
}

// Single spine pair at row y
function SpinePair(y: number) {
  return (
    <>
      {px(4, y, 1, 1, C.spine)}
      {px(11, y, 1, 1, C.spine)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function CactusStage1() {
  // Tiny nub just out of soil
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.bodyMid)}
    </>
  );
}

export function CactusStage2() {
  // Small round barrel — 4px tall, 4px wide, already showing roundness
  return (
    <>
      <Pot />
      {px(6, 8, 4, 3, C.bodyMid)}
      {px(7, 8, 2, 3, C.bodyLight)}
      {px(6, 8, 1, 3, C.ribLine)}
      {px(9, 8, 1, 3, C.ribLine)}
      {px(7, 7, 2, 1, C.bodyMid)}
    </>
  );
}

export function CactusStage3() {
  // Taller barrel (6px wide) with first visible spines
  return (
    <>
      <Pot />
      {BarrelBody(6, 4)}
      {SpinePair(7)}
      {SpinePair(9)}
    </>
  );
}

export function CactusStage4() {
  // Full barrel + small arm stubs bending upward
  return (
    <>
      <Pot />
      {BarrelBody(4, 6)}
      {SpinePair(5)}
      {SpinePair(7)}
      {SpinePair(9)}
      {/* left arm stub — horizontal then up */}
      {px(3, 7, 2, 2, C.bodyDark)}
      {px(3, 6, 1, 1, C.bodyDark)}
      {px(4, 7, 1, 2, C.ribLine)}
      {/* right arm stub */}
      {px(11, 7, 2, 2, C.bodyDark)}
      {px(12, 6, 1, 1, C.bodyDark)}
      {px(11, 7, 1, 2, C.ribLine)}
      {/* arm tip spines */}
      {px(2, 7, 1, 1, C.spine)}
      {px(13, 7, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage5() {
  // Full saguaro — arms rise to mid-height then go up
  return (
    <>
      <Pot />
      {BarrelBody(3, 7)}
      {SpinePair(4)}
      {SpinePair(6)}
      {SpinePair(8)}
      {/* left arm: out at row 7, elbow up at row 5 */}
      {px(3, 6, 2, 2, C.bodyDark)}
      {px(3, 4, 1, 2, C.bodyDark)}
      {px(4, 6, 1, 2, C.ribLine)}
      {px(3, 4, 1, 1, C.ribLine)}
      {/* right arm */}
      {px(11, 6, 2, 2, C.bodyDark)}
      {px(12, 4, 1, 2, C.bodyDark)}
      {px(11, 6, 1, 2, C.ribLine)}
      {px(12, 4, 1, 1, C.ribLine)}
      {/* arm spines */}
      {px(2, 6, 1, 1, C.spine)}
      {px(13, 6, 1, 1, C.spine)}
      {px(3, 3, 1, 1, C.spine)}
      {px(12, 3, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage6() {
  // Full saguaro + crown bloom (3 flowers in a cluster)
  return (
    <>
      <Pot />
      {BarrelBody(3, 7)}
      {SpinePair(4)}
      {SpinePair(6)}
      {SpinePair(8)}
      {px(3, 6, 2, 2, C.bodyDark)}
      {px(3, 4, 1, 2, C.bodyDark)}
      {px(4, 6, 1, 2, C.ribLine)}
      {px(3, 4, 1, 1, C.ribLine)}
      {px(11, 6, 2, 2, C.bodyDark)}
      {px(12, 4, 1, 2, C.bodyDark)}
      {px(11, 6, 1, 2, C.ribLine)}
      {px(12, 4, 1, 1, C.ribLine)}
      {px(2, 6, 1, 1, C.spine)}
      {px(13, 6, 1, 1, C.spine)}
      {px(3, 3, 1, 1, C.spine)}
      {px(12, 3, 1, 1, C.spine)}
      {/* crown bloom — 3-petal cluster on top */}
      {px(6, 2, 1, 1, C.flowerPink)}
      {px(9, 2, 1, 1, C.flowerPink)}
      {px(7, 1, 2, 2, C.flowerPink)}
      {px(7, 0, 2, 1, C.flowerWhite)}
      {px(7, 1, 2, 1, C.flowerYellow)}
      {px(6, 2, 4, 1, C.flowerYellow)}
    </>
  );
}

// ── Cactus palette ───────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  bodyDark: "#2d7a3a",
  bodyMid: "#3a9a48",
  bodyLight: "#5ab858",
  spine: "#f5f0e0",
  flowerRed: "#e83a3a",
  flowerYellow: "#f5c842",
  ribLine: "#1d5a2a",
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

// ── Stages ───────────────────────────────────────────────────────────────────
export function CactusStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.bodyMid)}
    </>
  );
}

export function CactusStage2() {
  return (
    <>
      <Pot />
      {/* small round body */}
      {px(6, 8, 4, 3, C.bodyMid)}
      {px(7, 8, 2, 3, C.bodyLight)}
      {px(6, 8, 1, 3, C.ribLine)}
      {px(9, 8, 1, 3, C.ribLine)}
    </>
  );
}

export function CactusStage3() {
  return (
    <>
      <Pot />
      {/* taller body */}
      {px(6, 6, 4, 4, C.bodyMid)}
      {px(7, 6, 2, 4, C.bodyLight)}
      {px(6, 6, 1, 4, C.ribLine)}
      {px(9, 6, 1, 4, C.ribLine)}
      {/* first spines */}
      {px(5, 7, 1, 1, C.spine)}
      {px(10, 7, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage4() {
  return (
    <>
      <Pot />
      {/* taller body with arm stubs */}
      {px(6, 4, 4, 6, C.bodyMid)}
      {px(7, 4, 2, 6, C.bodyLight)}
      {px(6, 4, 1, 6, C.ribLine)}
      {px(9, 4, 1, 6, C.ribLine)}
      {px(5, 5, 1, 1, C.spine)}
      {px(10, 5, 1, 1, C.spine)}
      {px(5, 7, 1, 1, C.spine)}
      {px(10, 7, 1, 1, C.spine)}
      {/* arm stubs */}
      {px(4, 6, 2, 1, C.bodyDark)}
      {px(10, 6, 2, 1, C.bodyDark)}
    </>
  );
}

export function CactusStage5() {
  return (
    <>
      <Pot />
      {/* full-height body */}
      {px(6, 3, 4, 7, C.bodyMid)}
      {px(7, 3, 2, 7, C.bodyLight)}
      {px(6, 3, 1, 7, C.ribLine)}
      {px(9, 3, 1, 7, C.ribLine)}
      {/* spines */}
      {px(5, 4, 1, 1, C.spine)}
      {px(10, 4, 1, 1, C.spine)}
      {px(5, 6, 1, 1, C.spine)}
      {px(10, 6, 1, 1, C.spine)}
      {px(5, 8, 1, 1, C.spine)}
      {px(10, 8, 1, 1, C.spine)}
      {/* arms — classic saguaro silhouette */}
      {px(3, 5, 3, 2, C.bodyDark)}
      {px(10, 5, 3, 2, C.bodyDark)}
      {px(3, 5, 1, 2, C.ribLine)}
      {px(12, 5, 1, 2, C.ribLine)}
      {/* arm tip spines */}
      {px(2, 5, 1, 1, C.spine)}
      {px(13, 5, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage6() {
  return (
    <>
      <Pot />
      {/* same body as stage 5 */}
      {px(6, 3, 4, 7, C.bodyMid)}
      {px(7, 3, 2, 7, C.bodyLight)}
      {px(6, 3, 1, 7, C.ribLine)}
      {px(9, 3, 1, 7, C.ribLine)}
      {px(5, 4, 1, 1, C.spine)}
      {px(10, 4, 1, 1, C.spine)}
      {px(5, 6, 1, 1, C.spine)}
      {px(10, 6, 1, 1, C.spine)}
      {px(5, 8, 1, 1, C.spine)}
      {px(10, 8, 1, 1, C.spine)}
      {px(3, 5, 3, 2, C.bodyDark)}
      {px(10, 5, 3, 2, C.bodyDark)}
      {px(3, 5, 1, 2, C.ribLine)}
      {px(12, 5, 1, 2, C.ribLine)}
      {px(2, 5, 1, 1, C.spine)}
      {px(13, 5, 1, 1, C.spine)}
      {/* bloom on top */}
      {px(7, 1, 2, 2, C.flowerRed)}
      {px(6, 2, 1, 1, C.flowerRed)}
      {px(9, 2, 1, 1, C.flowerRed)}
      {px(7, 2, 2, 1, C.flowerYellow)}
    </>
  );
}

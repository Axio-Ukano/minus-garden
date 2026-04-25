// ── Orchid palette ────────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafThick: "#3d8a3c",
  leafLight: "#5ab050",
  rootAerial: "#8ab878",
  petalDeep: "#8b1fa0",
  petalMid: "#b040c8",
  petalLight: "#d880e8",
  petalPale: "#f0c0f5",
  lip: "#f5c842",
  lipAccent: "#e87820",
  bud: "#c060d0",
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
export function OrchidStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function OrchidStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {/* thick flat seed leaves */}
      {px(5, 9, 3, 1, C.leafThick)}
      {px(8, 9, 3, 1, C.leafThick)}
    </>
  );
}

export function OrchidStage3() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(4, 8, 3, 2, C.leafThick)}
      {px(9, 8, 3, 2, C.leafThick)}
      {/* aerial roots */}
      {px(5, 10, 1, 1, C.rootAerial)}
      {px(10, 10, 1, 1, C.rootAerial)}
    </>
  );
}

export function OrchidStage4() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {/* wide waxy leaves */}
      {px(3, 7, 4, 3, C.leafThick)}
      {px(9, 7, 4, 3, C.leafThick)}
      {px(3, 7, 1, 3, C.leafLight)}
      {px(12, 7, 1, 3, C.leafLight)}
      {px(5, 10, 1, 1, C.rootAerial)}
      {px(10, 10, 1, 1, C.rootAerial)}
    </>
  );
}

export function OrchidStage5() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(3, 7, 4, 3, C.leafThick)}
      {px(9, 7, 4, 3, C.leafThick)}
      {px(5, 10, 1, 1, C.rootAerial)}
      {px(10, 10, 1, 1, C.rootAerial)}
      {/* single pointed bud */}
      {px(6, 2, 4, 2, C.bud)}
      {px(7, 1, 2, 1, C.bud)}
    </>
  );
}

export function OrchidStage6() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(3, 7, 4, 3, C.leafThick)}
      {px(9, 7, 4, 3, C.leafThick)}
      {px(5, 10, 1, 1, C.rootAerial)}
      {px(10, 10, 1, 1, C.rootAerial)}
      {/* half-open */}
      {px(4, 2, 3, 2, C.petalMid)}
      {px(9, 2, 3, 2, C.petalMid)}
      {px(6, 0, 4, 2, C.petalMid)}
      {px(6, 4, 4, 1, C.lip)}
      {px(7, 2, 2, 2, C.petalDeep)}
    </>
  );
}

export function OrchidStage7() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(3, 7, 4, 3, C.leafThick)}
      {px(9, 7, 4, 3, C.leafThick)}
      {px(5, 10, 1, 1, C.rootAerial)}
      {px(10, 10, 1, 1, C.rootAerial)}
      {/* dorsal sepal top */}
      {px(6, 0, 4, 2, C.petalLight)}
      {px(7, 0, 2, 1, C.petalPale)}
      {/* lateral petals */}
      {px(3, 2, 4, 2, C.petalMid)}
      {px(9, 2, 4, 2, C.petalMid)}
      {/* lateral sepals */}
      {px(4, 3, 3, 1, C.petalDeep)}
      {px(9, 3, 3, 1, C.petalDeep)}
      {/* labellum (lip) */}
      {px(5, 4, 6, 2, C.lip)}
      {px(6, 5, 4, 1, C.lipAccent)}
      {/* column */}
      {px(7, 2, 2, 2, C.petalDeep)}
    </>
  );
}

export function OrchidStage8() {
  return (
    <>
      <Pot />
      {px(7, 4, 2, 6, C.stem)}
      {px(3, 7, 4, 3, C.leafThick)}
      {px(9, 7, 4, 3, C.leafThick)}
      {px(5, 10, 1, 1, C.rootAerial)}
      {px(10, 10, 1, 1, C.rootAerial)}
      {/* dorsal sepal — wider */}
      {px(5, 0, 6, 2, C.petalLight)}
      {px(6, 0, 4, 1, C.petalPale)}
      {/* lateral petals — extended */}
      {px(2, 1, 5, 3, C.petalMid)}
      {px(9, 1, 5, 3, C.petalMid)}
      {/* lateral sepals — wider */}
      {px(3, 3, 4, 2, C.petalDeep)}
      {px(9, 3, 4, 2, C.petalDeep)}
      {/* labellum — wider with rounded edges */}
      {px(5, 4, 6, 2, C.lip)}
      {px(6, 5, 4, 1, C.lipAccent)}
      {px(5, 5, 1, 1, C.lip)}
      {px(10, 5, 1, 1, C.lip)}
      {/* column with pale highlight */}
      {px(7, 2, 2, 2, C.petalDeep)}
      {px(7, 3, 2, 1, C.petalPale)}
    </>
  );
}

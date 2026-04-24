// ── Lavanda palette ──────────────────────────────────────────────────────────
const C = {
  soil: "#7a5c4a",
  pot: "#c8956a",
  potBorder: "#3d2b1f",
  stem: "#5a8a3c",
  leafGreen: "#3d6b28",
  stalk: "#8ab450",
  spikeDark: "#6b3d8a",
  spikeMid: "#9b5fc0",
  spikeLight: "#c490e0",
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
export function LavandaStage1() {
  return (
    <>
      <Pot />
      {px(7, 10, 2, 1, C.stem)}
    </>
  );
}

export function LavandaStage2() {
  return (
    <>
      <Pot />
      {px(7, 8, 2, 2, C.stem)}
      {px(6, 8, 1, 1, C.leafGreen)}
      {px(9, 8, 1, 1, C.leafGreen)}
    </>
  );
}

export function LavandaStage3() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
    </>
  );
}

export function LavandaStage4() {
  return (
    <>
      <Pot />
      {px(7, 5, 2, 5, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {/* central stalk beginning */}
      {px(7, 3, 2, 2, C.stalk)}
      {px(7, 2, 2, 1, C.spikeMid)}
    </>
  );
}

export function LavandaStage5() {
  return (
    <>
      <Pot />
      {px(7, 6, 2, 4, C.stem)}
      {px(5, 7, 2, 2, C.leafGreen)}
      {px(9, 7, 2, 2, C.leafGreen)}
      {/* left spike */}
      {px(5, 4, 1, 5, C.stalk)}
      {px(5, 2, 1, 2, C.spikeDark)}
      {px(5, 1, 1, 1, C.spikeMid)}
      {px(5, 0, 1, 1, C.spikeLight)}
      {/* center spike — tallest */}
      {px(7, 4, 2, 2, C.stalk)}
      {px(7, 1, 2, 3, C.spikeDark)}
      {px(7, 0, 2, 1, C.spikeMid)}
      {px(8, 0, 1, 1, C.spikeLight)}
      {/* right spike */}
      {px(10, 5, 1, 4, C.stalk)}
      {px(10, 2, 1, 3, C.spikeDark)}
      {px(10, 1, 1, 2, C.spikeMid)}
    </>
  );
}

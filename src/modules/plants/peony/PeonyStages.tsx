// ── Peony — grid 24×30, shared pot (see shared/PotSprite) ────────────────────
// Reddish shoots at emergence (typical of peony) and lush double flower.
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#4a8a2e",
  stemDark: "#2d5a1e",
  shoot: "#b04848",
  shootLight: "#d07060",
  leaf: "#2f6e26",
  leafLight: "#4f9840",
  leafDark: "#1c4a16",
  leafShine: "#72bc5c",
  budGreen: "#5a9038",
  budLight: "#78b454",
  budDark: "#3a6824",
  sepal: "#4a7a30",
  sepalDark: "#2e5420",
  petalDeep: "#a01c48",
  petalDark: "#c02858",
  petalMid: "#e84e80",
  petalLight: "#f87ea6",
  petalPale: "#ffaec8",
  petalCream: "#ffd6e2",
  stamen: "#f8d040",
} as const;

function Stem(topY: number) {
  const rects = [];
  for (let y = topY; y <= 21; y++) {
    rects.push(px(11, y, 2, 1, y % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

// Compound leaf — central leaflet with two side ones
function CompoundLeafLeft(y: number) {
  return (
    <>
      {px(6, y - 2, 3, 1, C.leafLight)}
      {px(5, y - 1, 3, 1, C.leaf)}
      {px(7, y, 4, 1, C.leafLight)}
      {px(4, y + 1, 7, 1, C.leaf)}
      {px(7, y + 1, 2, 1, C.leafShine)}
      {px(5, y + 2, 4, 1, C.leafDark)}
      {px(6, y + 3, 3, 1, C.leaf)}
      {px(5, y + 4, 2, 1, C.leafDark)}
    </>
  );
}

function CompoundLeafRight(y: number) {
  return (
    <>
      {px(15, y - 2, 3, 1, C.leafLight)}
      {px(16, y - 1, 3, 1, C.leaf)}
      {px(13, y, 4, 1, C.leafLight)}
      {px(13, y + 1, 7, 1, C.leaf)}
      {px(15, y + 1, 2, 1, C.leafShine)}
      {px(15, y + 2, 4, 1, C.leafDark)}
      {px(15, y + 3, 3, 1, C.leaf)}
      {px(17, y + 4, 2, 1, C.leafDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function PeonyStage1() {
  // Reddish shoot just emerged
  return (
    <>
      <Pot />
      {px(11, 18, 2, 4, C.shoot)}
      {px(10, 16, 2, 2, C.shootLight)}
      {px(12, 17, 2, 1, C.shoot)}
      {px(10, 16, 1, 1, C.shootLight)}
      {px(13, 16, 1, 1, C.shootLight)}
    </>
  );
}

export function PeonyStage2() {
  // Red-green shoots with first leaves
  return (
    <>
      <Pot />
      {px(11, 18, 2, 4, C.shoot)}
      {px(11, 14, 2, 4, C.stem)}
      {/* reddish left leaf */}
      {px(8, 13, 3, 1, C.shootLight)}
      {px(7, 14, 4, 1, C.shoot)}
      {px(8, 15, 2, 1, C.shoot)}
      {/* green right leaf */}
      {px(13, 12, 3, 1, C.leafLight)}
      {px(13, 13, 4, 1, C.leaf)}
      {px(14, 14, 2, 1, C.leafDark)}
    </>
  );
}

export function PeonyStage3() {
  // Dense compound foliage
  return (
    <>
      <Pot />
      {Stem(10)}
      {CompoundLeafLeft(14)}
      {CompoundLeafRight(12)}
      {/* top tuft */}
      {px(11, 8, 2, 1, C.leafShine)}
      {px(10, 9, 4, 1, C.leafLight)}
    </>
  );
}

export function PeonyStage4() {
  // Round tight bud with sepals
  return (
    <>
      <Pot />
      {Stem(7)}
      {CompoundLeafLeft(15)}
      {CompoundLeafRight(13)}
      {/* green ball */}
      {px(11, 2, 2, 1, C.budGreen)}
      {px(10, 3, 4, 3, C.budGreen)}
      {px(10, 3, 1, 3, C.budLight)}
      {px(13, 3, 1, 3, C.budDark)}
      {px(10, 6, 4, 1, C.budDark)}
      {/* first pink blush */}
      {px(12, 2, 1, 1, C.petalMid)}
      {/* sepals */}
      {px(9, 4, 1, 3, C.sepal)}
      {px(14, 4, 1, 3, C.sepal)}
    </>
  );
}

export function PeonyStage5() {
  // Bud showing pink — half ball
  return (
    <>
      <Pot />
      {Stem(8)}
      {CompoundLeafLeft(15)}
      {CompoundLeafRight(13)}
      {/* pink dome */}
      {px(11, 2, 2, 1, C.petalLight)}
      {px(10, 3, 4, 1, C.petalMid)}
      {px(9, 4, 6, 1, C.petalMid)}
      {px(10, 4, 2, 1, C.petalLight)}
      {/* green cup */}
      {px(9, 5, 6, 1, C.budGreen)}
      {px(9, 5, 1, 1, C.budDark)}
      {px(14, 5, 1, 1, C.budDark)}
      {px(10, 6, 4, 1, C.budGreen)}
      {px(10, 7, 4, 1, C.budDark)}
      {/* sepals */}
      {px(8, 4, 1, 3, C.sepal)}
      {px(15, 4, 1, 3, C.sepal)}
    </>
  );
}

export function PeonyStage6() {
  // Semi-open cup with cream center
  return (
    <>
      <Pot />
      {Stem(9)}
      {CompoundLeafLeft(16)}
      {CompoundLeafRight(14)}
      {/* top rim */}
      {px(9, 1, 2, 1, C.petalPale)}
      {px(13, 1, 2, 1, C.petalPale)}
      {/* opening */}
      {px(8, 2, 8, 2, C.petalLight)}
      {px(10, 2, 4, 1, C.petalCream)}
      {px(11, 3, 2, 1, C.stamen)}
      {/* outer bell-shaped petals */}
      {px(6, 4, 12, 3, C.petalMid)}
      {px(6, 4, 1, 3, C.petalDeep)}
      {px(17, 4, 1, 3, C.petalDeep)}
      {px(8, 4, 2, 2, C.petalLight)}
      {px(7, 7, 10, 1, C.petalDark)}
      {/* sepals */}
      {px(8, 8, 8, 1, C.sepal)}
      {px(9, 9, 6, 1, C.sepalDark)}
    </>
  );
}

export function PeonyStage7() {
  // Full peony — huge double flower with ruffles
  return (
    <>
      <Pot />
      {Stem(10)}
      {CompoundLeafLeft(16)}
      {CompoundLeafRight(14)}
      {/* zigzag crown */}
      {px(9, 0, 1, 1, C.petalCream)}
      {px(13, 0, 1, 1, C.petalCream)}
      {px(8, 1, 3, 1, C.petalPale)}
      {px(12, 1, 3, 1, C.petalPale)}
      {/* top layer */}
      {px(7, 2, 10, 3, C.petalLight)}
      {px(10, 2, 4, 1, C.petalPale)}
      {px(10, 3, 1, 1, C.petalMid)}
      {px(13, 3, 1, 1, C.petalMid)}
      {/* mid layer */}
      {px(5, 3, 14, 4, C.petalMid)}
      {px(8, 4, 1, 2, C.petalDark)}
      {px(12, 4, 1, 2, C.petalDark)}
      {px(15, 4, 1, 2, C.petalDark)}
      {/* cream center with stamens */}
      {px(9, 3, 6, 2, C.petalPale)}
      {px(10, 4, 4, 2, C.petalCream)}
      {px(11, 5, 2, 1, C.stamen)}
      {/* outer layer — widest */}
      {px(3, 5, 18, 3, C.petalDark)}
      {px(3, 5, 1, 3, C.petalDeep)}
      {px(20, 5, 1, 3, C.petalDeep)}
      {px(5, 5, 14, 1, C.petalMid)}
      {/* lower scallops */}
      {px(4, 8, 4, 1, C.petalDeep)}
      {px(10, 8, 4, 1, C.petalDeep)}
      {px(16, 8, 4, 1, C.petalDeep)}
      {/* sepals */}
      {px(8, 9, 8, 1, C.sepal)}
      {px(9, 10, 6, 1, C.sepalDark)}
    </>
  );
}

// ── Carnation — grid 24×30, shared pot (see shared/PotSprite) ────────────────
// Blue-green foliage, calyx in urn and flower with scalloped petals.
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#5a8868",
  stemDark: "#3a6448",
  stemLight: "#7cae8e",
  leafShine: "#a0ccae",
  calyx: "#4a7a58",
  calyxDark: "#2e5440",
  calyxLight: "#6aa080",
  petal: "#e84864",
  petalLight: "#f87890",
  petalPale: "#ffaebc",
  petalDark: "#d22440",
  petalDeep: "#9a1428",
} as const;

function Stem(topY: number) {
  const rects = [];
  for (let y = topY; y <= 21; y++) {
    rects.push(px(11, y, 2, 1, y % 4 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

// Narrow opposite leaves, pointing up and out
function LeafLeft(y: number) {
  return (
    <>
      {px(8, y, 3, 1, C.stemLight)}
      {px(6, y - 1, 3, 1, C.stem)}
      {px(5, y - 2, 2, 1, C.stemDark)}
    </>
  );
}

function LeafRight(y: number) {
  return (
    <>
      {px(13, y, 3, 1, C.stemLight)}
      {px(15, y - 1, 3, 1, C.stem)}
      {px(17, y - 2, 2, 1, C.stemDark)}
    </>
  );
}

// Calyx in urn with teeth
function Calyx(y: number) {
  return (
    <>
      {px(10, y, 1, 1, C.calyxDark)}
      {px(13, y, 1, 1, C.calyxDark)}
      {px(10, y + 1, 4, 2, C.calyx)}
      {px(10, y + 1, 4, 1, C.calyxLight)}
      {px(11, y + 3, 2, 1, C.calyxDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function CarnationStage1() {
  // Blue-green shoot with first opposite leaflets
  return (
    <>
      <Pot />
      {px(11, 18, 2, 4, C.stem)}
      {px(11, 17, 2, 1, C.stemLight)}
      {px(9, 17, 2, 1, C.leafShine)}
      {px(13, 17, 2, 1, C.stemLight)}
    </>
  );
}

export function CarnationStage2() {
  // Young stem with two pairs of narrow leaves
  return (
    <>
      <Pot />
      {Stem(15)}
      {px(11, 14, 2, 1, C.stemLight)}
      {LeafLeft(18)}
      {LeafRight(16)}
    </>
  );
}

export function CarnationStage3() {
  // Closed calyx with red tip peeking
  return (
    <>
      <Pot />
      {Stem(9)}
      {LeafLeft(18)}
      {LeafRight(16)}
      {LeafLeft(13)}
      {/* red tip */}
      {px(11, 3, 2, 2, C.petal)}
      {px(11, 3, 2, 1, C.petalLight)}
      {Calyx(4)}
    </>
  );
}

export function CarnationStage4() {
  // Bud tearing open — first ruffle of petals
  return (
    <>
      <Pot />
      {Stem(10)}
      {LeafLeft(18)}
      {LeafRight(16)}
      {LeafLeft(13)}
      {/* ruffle */}
      {px(10, 2, 1, 1, C.petalPale)}
      {px(12, 2, 1, 1, C.petalPale)}
      {px(10, 3, 4, 1, C.petalLight)}
      {px(9, 4, 6, 1, C.petal)}
      {px(9, 5, 6, 1, C.petalDark)}
      {Calyx(6)}
    </>
  );
}

export function CarnationStage5() {
  // Flower half-open — scalloped fan
  return (
    <>
      <Pot />
      {Stem(11)}
      {LeafLeft(18)}
      {LeafRight(16)}
      {LeafLeft(13)}
      {/* petal fan */}
      {px(8, 2, 1, 1, C.petalLight)}
      {px(10, 2, 2, 1, C.petalPale)}
      {px(13, 2, 1, 1, C.petalLight)}
      {px(15, 2, 1, 1, C.petalPale)}
      {px(8, 3, 8, 1, C.petalLight)}
      {px(7, 4, 10, 1, C.petal)}
      {px(9, 4, 1, 1, C.petalDeep)}
      {px(13, 4, 1, 1, C.petalDeep)}
      {px(7, 5, 10, 1, C.petal)}
      {px(8, 6, 8, 1, C.petalDark)}
      {/* side fringes */}
      {px(6, 4, 1, 2, C.petalLight)}
      {px(17, 4, 1, 2, C.petalLight)}
      {Calyx(7)}
    </>
  );
}

export function CarnationStage6() {
  // Full carnation — exuberant scalloped pompom
  return (
    <>
      <Pot />
      {Stem(11)}
      {LeafLeft(19)}
      {LeafRight(17)}
      {LeafLeft(14)}
      {LeafRight(13)}
      {/* top edge in zigzag */}
      {px(8, 1, 1, 1, C.petalPale)}
      {px(10, 1, 1, 1, C.petalPale)}
      {px(12, 1, 2, 1, C.petalPale)}
      {px(15, 1, 1, 1, C.petalPale)}
      {/* pompom body */}
      {px(8, 2, 8, 1, C.petalLight)}
      {px(7, 3, 10, 1, C.petalLight)}
      {px(9, 3, 2, 1, C.petalPale)}
      {px(12, 3, 2, 1, C.petalPale)}
      {px(6, 4, 12, 1, C.petal)}
      {px(8, 4, 1, 1, C.petalDeep)}
      {px(11, 4, 2, 1, C.petalDeep)}
      {px(15, 4, 1, 1, C.petalDeep)}
      {px(6, 5, 12, 1, C.petal)}
      {px(9, 5, 2, 1, C.petalDeep)}
      {px(13, 5, 2, 1, C.petalDeep)}
      {px(7, 6, 10, 1, C.petalDark)}
      {px(8, 7, 8, 1, C.petalDeep)}
      {/* side fringes */}
      {px(5, 4, 1, 2, C.petalLight)}
      {px(18, 4, 1, 2, C.petalLight)}
      {px(6, 3, 1, 1, C.petalPale)}
      {px(17, 3, 1, 1, C.petalPale)}
      {Calyx(8)}
      {/* curved sepals */}
      {px(9, 9, 1, 2, C.calyxDark)}
      {px(14, 9, 1, 2, C.calyxDark)}
    </>
  );
}

// ── Daisy — grid 24×30, shared pot (see shared/PotSprite) ────────────────────
import { Pot, px } from "../shared/PotSprite";

const C = {
  stem: "#4a8a2e",
  stemDark: "#2d5a1e",
  stemLight: "#6cb244",
  leaf: "#3a7a24",
  leafLight: "#5aa83c",
  leafDark: "#1e4a14",
  leafShine: "#82cc58",
  bud: "#5aa83c",
  budDark: "#2d6a1c",
  petal: "#fdfbf6",
  petalBase: "#e8dcc8",
  petalHi: "#ffffff",
  center: "#f8c838",
  centerLight: "#ffe066",
  centerDark: "#cf9412",
  centerDeep: "#a06b10",
} as const;

function Stem(topY: number) {
  const rects = [];
  for (let y = topY; y <= 21; y++) {
    rects.push(px(11, y, 2, 1, y % 3 === 0 ? C.stemDark : C.stem));
  }
  return <>{rects}</>;
}

function LeafLeft(y: number) {
  return (
    <>
      {px(7, y, 4, 1, C.leafLight)}
      {px(5, y + 1, 6, 1, C.leaf)}
      {px(8, y + 1, 2, 1, C.leafShine)}
      {px(6, y + 2, 4, 1, C.leafDark)}
    </>
  );
}

function LeafRight(y: number) {
  return (
    <>
      {px(13, y, 4, 1, C.leafLight)}
      {px(13, y + 1, 6, 1, C.leaf)}
      {px(14, y + 1, 2, 1, C.leafShine)}
      {px(14, y + 2, 4, 1, C.leafDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function DaisyStage1() {
  // Freshly germinated seed — V-shaped shoot breaking the soil
  return (
    <>
      <Pot />
      {px(11, 19, 2, 3, C.stem)}
      {px(11, 18, 2, 1, C.stemLight)}
      {px(9, 17, 2, 2, C.leafLight)}
      {px(9, 17, 1, 1, C.leafShine)}
      {px(13, 17, 2, 2, C.leaf)}
      {px(11, 17, 2, 1, C.leafLight)}
    </>
  );
}

export function DaisyStage2() {
  // Seedling with two rounded cotyledons
  return (
    <>
      <Pot />
      {Stem(16)}
      {px(11, 15, 2, 1, C.stemLight)}
      {/* left cotyledon */}
      {px(7, 13, 3, 1, C.leafLight)}
      {px(6, 14, 5, 1, C.leaf)}
      {px(7, 15, 3, 1, C.leafDark)}
      {/* right cotyledon */}
      {px(14, 12, 3, 1, C.leafLight)}
      {px(13, 13, 5, 1, C.leaf)}
      {px(14, 14, 3, 1, C.leafDark)}
    </>
  );
}

export function DaisyStage3() {
  // Young stem with true leaves and a top tuft
  return (
    <>
      <Pot />
      {Stem(10)}
      {LeafLeft(13)}
      {LeafRight(11)}
      {/* top tuft */}
      {px(11, 7, 2, 1, C.leafShine)}
      {px(10, 8, 4, 2, C.leafLight)}
      {px(10, 9, 1, 1, C.leaf)}
      {px(13, 9, 1, 1, C.leaf)}
    </>
  );
}

export function DaisyStage4() {
  // Closed bud with petal tips peeking out
  return (
    <>
      <Pot />
      {Stem(7)}
      {LeafLeft(13)}
      {LeafRight(11)}
      {/* peeking petals */}
      {px(11, 1, 2, 1, C.petalHi)}
      {px(10, 2, 4, 1, C.petal)}
      {/* calyx */}
      {px(10, 3, 4, 3, C.bud)}
      {px(10, 3, 1, 3, C.budDark)}
      {px(13, 3, 1, 3, C.budDark)}
      {px(10, 6, 4, 1, C.budDark)}
      {/* sepals */}
      {px(9, 4, 1, 2, C.leaf)}
      {px(14, 4, 1, 2, C.leaf)}
    </>
  );
}

export function DaisyStage5() {
  // Open flower — 8 white petals around the yellow disc
  return (
    <>
      <Pot />
      {Stem(12)}
      {LeafLeft(14)}
      {LeafRight(13)}
      {/* north petal */}
      {px(11, 0, 2, 1, C.petalHi)}
      {px(10, 1, 4, 3, C.petal)}
      {px(12, 1, 1, 3, C.petalBase)}
      {/* south petal */}
      {px(10, 8, 4, 3, C.petal)}
      {px(11, 11, 2, 1, C.petal)}
      {px(11, 9, 1, 2, C.petalBase)}
      {/* west petal */}
      {px(4, 5, 1, 2, C.petalHi)}
      {px(5, 5, 5, 2, C.petal)}
      {px(9, 5, 1, 2, C.petalBase)}
      {/* east petal */}
      {px(19, 5, 1, 2, C.petalHi)}
      {px(14, 5, 5, 2, C.petal)}
      {px(14, 5, 1, 2, C.petalBase)}
      {/* NW diagonal */}
      {px(6, 1, 2, 2, C.petal)}
      {px(7, 2, 2, 2, C.petal)}
      {px(8, 3, 2, 1, C.petalBase)}
      {/* NE diagonal */}
      {px(16, 1, 2, 2, C.petal)}
      {px(15, 2, 2, 2, C.petal)}
      {px(14, 3, 2, 1, C.petalBase)}
      {/* SW diagonal */}
      {px(6, 9, 2, 2, C.petal)}
      {px(7, 8, 2, 2, C.petal)}
      {px(8, 7, 2, 1, C.petalBase)}
      {/* SE diagonal */}
      {px(16, 9, 2, 2, C.petal)}
      {px(15, 8, 2, 2, C.petal)}
      {px(14, 7, 2, 1, C.petalBase)}
      {/* central disc */}
      {px(10, 4, 4, 4, C.center)}
      {px(10, 4, 4, 1, C.centerLight)}
      {px(10, 7, 4, 1, C.centerDark)}
      {px(11, 5, 1, 1, C.centerDeep)}
      {px(13, 6, 1, 1, C.centerDeep)}
      {px(10, 6, 1, 1, C.centerDark)}
    </>
  );
}

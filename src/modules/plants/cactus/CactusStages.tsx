// ── Cactus — grid 24×30, shared pot (see shared/PotSprite) ───────────────────
// Saguaro de barril con costillas, espinas y corona de flores rosas.
import { Pot, px } from "../shared/PotSprite";

const C = {
  body: "#2f7e3c",
  bodyDark: "#1e5c28",
  bodyLight: "#48a456",
  shine: "#74cc7c",
  rib: "#236331",
  spine: "#f2f2d8",
  flowerPink: "#f0509a",
  flowerLight: "#ff86c0",
  flowerDeep: "#c02870",
  flowerCenter: "#ffd84a",
  pebble: "#a89888",
  pebbleDark: "#8a7a68",
} as const;

// Cuerpo de barril con tapa redondeada, costillas y brillo
function Barrel(x: number, y: number, w: number, h: number) {
  const rects = [];
  rects.push(px(x + 1, y, w - 2, 1, C.bodyLight));
  rects.push(px(x, y + 1, w, h - 1, C.body));
  rects.push(px(x, y + 1, 1, h - 1, C.bodyDark));
  rects.push(px(x + w - 1, y + 1, 1, h - 1, C.bodyDark));
  for (let cx = x + 2; cx < x + w - 2; cx += 2) {
    rects.push(px(cx, y + 1, 1, h - 1, C.rib));
  }
  rects.push(px(x + 1, y + 1, 1, 2, C.shine));
  return <>{rects}</>;
}

function Pebbles() {
  return (
    <>
      {px(7, 20, 2, 1, C.pebble)}
      {px(15, 21, 2, 1, C.pebbleDark)}
      {px(16, 20, 1, 1, C.pebble)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function CactusStage1() {
  // Botoncito recién brotado entre piedritas
  return (
    <>
      <Pot />
      {Pebbles()}
      {px(11, 17, 2, 1, C.bodyLight)}
      {px(10, 18, 4, 3, C.body)}
      {px(10, 18, 1, 3, C.bodyDark)}
      {px(13, 18, 1, 3, C.bodyDark)}
      {px(11, 18, 1, 2, C.shine)}
      {/* espinas */}
      {px(9, 18, 1, 1, C.spine)}
      {px(14, 18, 1, 1, C.spine)}
      {px(11, 16, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage2() {
  // Barril pequeño
  return (
    <>
      <Pot />
      {Pebbles()}
      {Barrel(9, 15, 6, 6)}
      {/* espinas */}
      {px(8, 16, 1, 1, C.spine)}
      {px(15, 16, 1, 1, C.spine)}
      {px(8, 19, 1, 1, C.spine)}
      {px(15, 19, 1, 1, C.spine)}
      {px(11, 14, 1, 1, C.spine)}
      {px(11, 17, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage3() {
  // Barril alto con más costillas
  return (
    <>
      <Pot />
      {Pebbles()}
      {Barrel(8, 10, 8, 11)}
      {/* espinas laterales */}
      {px(7, 12, 1, 1, C.spine)}
      {px(16, 12, 1, 1, C.spine)}
      {px(7, 15, 1, 1, C.spine)}
      {px(16, 15, 1, 1, C.spine)}
      {px(7, 18, 1, 1, C.spine)}
      {px(16, 18, 1, 1, C.spine)}
      {/* espinas superiores y de costilla */}
      {px(10, 9, 1, 1, C.spine)}
      {px(13, 9, 1, 1, C.spine)}
      {px(10, 13, 1, 1, C.spine)}
      {px(12, 16, 1, 1, C.spine)}
      {px(10, 18, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage4() {
  // Tronco alto con muñones de brazos
  return (
    <>
      <Pot />
      {Pebbles()}
      {Barrel(9, 8, 6, 13)}
      {/* muñón izquierdo */}
      {px(6, 12, 3, 1, C.bodyLight)}
      {px(5, 13, 4, 2, C.body)}
      {px(5, 13, 1, 2, C.bodyDark)}
      {/* muñón derecho */}
      {px(15, 13, 3, 1, C.bodyLight)}
      {px(15, 14, 4, 2, C.body)}
      {px(18, 14, 1, 2, C.bodyDark)}
      {/* espinas */}
      {px(4, 13, 1, 1, C.spine)}
      {px(19, 14, 1, 1, C.spine)}
      {px(8, 10, 1, 1, C.spine)}
      {px(15, 10, 1, 1, C.spine)}
      {px(8, 16, 1, 1, C.spine)}
      {px(15, 18, 1, 1, C.spine)}
      {px(11, 7, 1, 1, C.spine)}
      {px(11, 12, 1, 1, C.spine)}
      {px(11, 17, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage5() {
  // Saguaro completo — brazos en L hacia arriba
  return (
    <>
      <Pot />
      {Pebbles()}
      {Barrel(9, 6, 6, 15)}
      {/* brazo izquierdo */}
      {px(6, 9, 2, 1, C.bodyLight)}
      {px(5, 10, 3, 6, C.body)}
      {px(5, 10, 1, 6, C.bodyDark)}
      {px(6, 10, 1, 2, C.shine)}
      {px(8, 13, 1, 3, C.body)}
      {/* brazo derecho — más bajo */}
      {px(16, 11, 2, 1, C.bodyLight)}
      {px(16, 12, 3, 5, C.body)}
      {px(18, 12, 1, 5, C.bodyDark)}
      {px(15, 14, 1, 3, C.body)}
      {/* espinas */}
      {px(4, 11, 1, 1, C.spine)}
      {px(4, 14, 1, 1, C.spine)}
      {px(19, 13, 1, 1, C.spine)}
      {px(19, 16, 1, 1, C.spine)}
      {px(8, 8, 1, 1, C.spine)}
      {px(15, 8, 1, 1, C.spine)}
      {px(8, 12, 1, 1, C.spine)}
      {px(15, 16, 1, 1, C.spine)}
      {px(8, 18, 1, 1, C.spine)}
      {px(11, 5, 1, 1, C.spine)}
      {px(11, 10, 1, 1, C.spine)}
      {px(11, 15, 1, 1, C.spine)}
      {px(11, 19, 1, 1, C.spine)}
    </>
  );
}

export function CactusStage6() {
  // Saguaro florecido — corona rosa en el tronco y los brazos
  return (
    <>
      <Pot />
      {Pebbles()}
      {Barrel(9, 6, 6, 15)}
      {/* brazo izquierdo */}
      {px(6, 9, 2, 1, C.bodyLight)}
      {px(5, 10, 3, 6, C.body)}
      {px(5, 10, 1, 6, C.bodyDark)}
      {px(6, 10, 1, 2, C.shine)}
      {px(8, 13, 1, 3, C.body)}
      {/* brazo derecho */}
      {px(16, 11, 2, 1, C.bodyLight)}
      {px(16, 12, 3, 5, C.body)}
      {px(18, 12, 1, 5, C.bodyDark)}
      {px(15, 14, 1, 3, C.body)}
      {/* espinas */}
      {px(4, 11, 1, 1, C.spine)}
      {px(4, 14, 1, 1, C.spine)}
      {px(19, 13, 1, 1, C.spine)}
      {px(19, 16, 1, 1, C.spine)}
      {px(8, 8, 1, 1, C.spine)}
      {px(15, 8, 1, 1, C.spine)}
      {px(8, 12, 1, 1, C.spine)}
      {px(15, 16, 1, 1, C.spine)}
      {px(11, 10, 1, 1, C.spine)}
      {px(11, 15, 1, 1, C.spine)}
      {px(11, 19, 1, 1, C.spine)}
      {/* flor principal en el tronco */}
      {px(10, 2, 1, 1, C.flowerLight)}
      {px(12, 2, 2, 1, C.flowerLight)}
      {px(9, 3, 6, 1, C.flowerPink)}
      {px(9, 4, 6, 1, C.flowerPink)}
      {px(9, 4, 1, 1, C.flowerDeep)}
      {px(14, 4, 1, 1, C.flowerDeep)}
      {px(11, 4, 2, 1, C.flowerCenter)}
      {px(10, 5, 4, 1, C.flowerDeep)}
      {/* flor del brazo izquierdo */}
      {px(5, 7, 3, 1, C.flowerPink)}
      {px(6, 6, 1, 1, C.flowerLight)}
      {px(6, 8, 1, 1, C.flowerCenter)}
      {/* flor del brazo derecho */}
      {px(16, 9, 3, 1, C.flowerPink)}
      {px(17, 8, 1, 1, C.flowerLight)}
      {px(17, 10, 1, 1, C.flowerCenter)}
    </>
  );
}

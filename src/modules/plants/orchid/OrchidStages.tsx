// ── Orchid — grid 24×30, shared pot (see shared/PotSprite) ───────────────────
// Phalaenopsis: hojas carnosas basales, raíces aéreas y vara arqueada
// con flores blanco-lila de labelo magenta.
import { Pot, px } from "../shared/PotSprite";

const C = {
  leaf: "#2e6a34",
  leafLight: "#449a4c",
  leafShine: "#6cc474",
  leafDark: "#1c4622",
  aerial: "#c2cfb6",
  aerialDark: "#94a488",
  spike: "#5a7838",
  spikeDark: "#3e5526",
  petalWhite: "#faf4ff",
  lilacEdge: "#d8b8f0",
  lilac: "#b88ce0",
  lip: "#e03898",
  lipDark: "#a8246e",
  column: "#f8d048",
  bud: "#c890e0",
  budDark: "#9060b0",
} as const;

// Flor de orquídea — caja 8×7, (x, y) = esquina superior izquierda
function Flower(x: number, y: number) {
  return (
    <>
      {/* sépalo dorsal */}
      {px(x + 3, y, 2, 1, C.lilacEdge)}
      {px(x + 3, y + 1, 2, 1, C.petalWhite)}
      {/* alas laterales */}
      {px(x, y + 2, 3, 3, C.petalWhite)}
      {px(x, y + 2, 1, 3, C.lilacEdge)}
      {px(x + 5, y + 2, 3, 3, C.petalWhite)}
      {px(x + 7, y + 2, 1, 3, C.lilacEdge)}
      {/* sépalos inferiores */}
      {px(x + 1, y + 5, 2, 2, C.lilac)}
      {px(x + 5, y + 5, 2, 2, C.lilac)}
      {/* columna y labelo */}
      {px(x + 3, y + 2, 2, 1, C.column)}
      {px(x + 3, y + 3, 2, 2, C.lip)}
      {px(x + 2, y + 4, 1, 1, C.lip)}
      {px(x + 5, y + 4, 1, 1, C.lip)}
      {px(x + 3, y + 5, 2, 1, C.lipDark)}
    </>
  );
}

// Capullo lila redondeado
function Bud(x: number, y: number) {
  return (
    <>
      {px(x, y, 2, 2, C.bud)}
      {px(x, y, 1, 1, C.petalWhite)}
      {px(x, y + 2, 2, 1, C.budDark)}
    </>
  );
}

// Hojas carnosas basales
function LeafLeftBig() {
  return (
    <>
      {px(9, 17, 3, 1, C.leafLight)}
      {px(6, 18, 6, 1, C.leaf)}
      {px(4, 19, 7, 1, C.leaf)}
      {px(5, 19, 3, 1, C.leafShine)}
      {px(3, 20, 6, 1, C.leafDark)}
      {px(4, 21, 4, 1, C.leafDark)}
    </>
  );
}

function LeafRightBig() {
  return (
    <>
      {px(12, 17, 3, 1, C.leafLight)}
      {px(12, 18, 6, 1, C.leaf)}
      {px(13, 19, 7, 1, C.leaf)}
      {px(16, 19, 3, 1, C.leafShine)}
      {px(15, 20, 6, 1, C.leafDark)}
      {px(16, 21, 4, 1, C.leafDark)}
    </>
  );
}

function LeafFront() {
  return (
    <>
      {px(10, 19, 4, 1, C.leafLight)}
      {px(8, 20, 5, 1, C.leaf)}
      {px(9, 21, 3, 1, C.leafDark)}
    </>
  );
}

// Raíz aérea colgando sobre el borde de la maceta
function AerialRoot() {
  return (
    <>
      {px(17, 19, 1, 2, C.aerial)}
      {px(18, 21, 1, 2, C.aerial)}
      {px(18, 23, 1, 2, C.aerialDark)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function OrchidStage1() {
  // Plántula — primera hojita carnosa
  return (
    <>
      <Pot />
      {px(10, 19, 3, 1, C.leafLight)}
      {px(9, 20, 3, 1, C.leaf)}
      {px(12, 20, 3, 1, C.leaf)}
      {px(13, 19, 2, 1, C.leafShine)}
      {px(11, 18, 2, 1, C.leafLight)}
    </>
  );
}

export function OrchidStage2() {
  // Dos hojas anchas y brillantes
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
    </>
  );
}

export function OrchidStage3() {
  // Tres hojas y raíz aérea
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
      {LeafFront()}
      {AerialRoot()}
    </>
  );
}

export function OrchidStage4() {
  // Vara floral asomando con primeros capullos
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
      {LeafFront()}
      {AerialRoot()}
      {/* vara arqueada */}
      {px(12, 14, 1, 3, C.spike)}
      {px(13, 12, 1, 2, C.spike)}
      {px(14, 10, 1, 2, C.spikeDark)}
      {px(15, 8, 1, 2, C.spike)}
      {/* capullos */}
      {Bud(14, 5)}
      {Bud(16, 9)}
    </>
  );
}

export function OrchidStage5() {
  // Vara más alta cargada de capullos
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
      {LeafFront()}
      {AerialRoot()}
      {/* vara */}
      {px(12, 14, 1, 3, C.spike)}
      {px(13, 12, 1, 2, C.spike)}
      {px(14, 10, 1, 2, C.spikeDark)}
      {px(15, 8, 1, 2, C.spike)}
      {px(16, 6, 1, 2, C.spikeDark)}
      {/* capullos */}
      {Bud(15, 3)}
      {Bud(13, 7)}
      {Bud(17, 8)}
    </>
  );
}

export function OrchidStage6() {
  // Primera flor abierta en lo alto
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
      {LeafFront()}
      {AerialRoot()}
      {/* vara */}
      {px(12, 14, 1, 3, C.spike)}
      {px(13, 12, 1, 2, C.spike)}
      {px(14, 10, 1, 2, C.spikeDark)}
      {px(15, 8, 1, 2, C.spike)}
      {px(16, 6, 1, 2, C.spikeDark)}
      {/* flor y capullos */}
      {Flower(12, 0)}
      {Bud(15, 8)}
      {Bud(12, 10)}
    </>
  );
}

export function OrchidStage7() {
  // Dos flores abiertas en cascada
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
      {LeafFront()}
      {AerialRoot()}
      {px(16, 18, 1, 2, C.aerialDark)}
      {/* vara */}
      {px(12, 15, 1, 2, C.spike)}
      {px(13, 13, 1, 2, C.spike)}
      {px(14, 11, 1, 2, C.spikeDark)}
      {px(15, 9, 1, 2, C.spike)}
      {px(16, 7, 1, 2, C.spikeDark)}
      {px(17, 5, 1, 2, C.spike)}
      {/* flores y capullo */}
      {Flower(13, 0)}
      {Flower(10, 6)}
      {px(11, 13, 1, 1, C.spike)}
      {Bud(9, 12)}
    </>
  );
}

export function OrchidStage8() {
  // Orquídea plena — tres flores en cascada
  return (
    <>
      <Pot />
      {LeafLeftBig()}
      {LeafRightBig()}
      {LeafFront()}
      {AerialRoot()}
      {px(16, 18, 1, 2, C.aerialDark)}
      {px(5, 19, 1, 2, C.aerial)}
      {px(4, 21, 1, 2, C.aerialDark)}
      {/* vara */}
      {px(12, 15, 1, 2, C.spike)}
      {px(13, 13, 1, 2, C.spike)}
      {px(14, 11, 1, 2, C.spikeDark)}
      {px(15, 9, 1, 2, C.spike)}
      {px(16, 7, 1, 2, C.spikeDark)}
      {px(17, 4, 1, 3, C.spike)}
      {/* cascada de flores */}
      {Flower(14, 0)}
      {Flower(11, 5)}
      {Flower(8, 10)}
      {Bud(19, 8)}
    </>
  );
}

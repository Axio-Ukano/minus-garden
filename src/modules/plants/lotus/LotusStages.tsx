// ── Lotus — grid 28×20, water scene (no pot — grows in a pond) ───────────────
// Estanque con barro, nenúfares con muesca en V y flor de pétalos puntiagudos
// con receptáculo dorado.
import { px } from "../shared/PotSprite";

const C = {
  waterDeep: "#1c3f74",
  waterMid: "#2c5da4",
  waterShallow: "#3a6fc0",
  waterLight: "#4f86d8",
  waterShine: "#7fb0ee",
  waterFoam: "#cfe2fb",
  mud: "#4a3828",
  mudDark: "#2e2218",
  mudLight: "#65503a",
  stem: "#3f7a34",
  stemLight: "#5ca84c",
  stemUnder: "#2c5630",
  padMid: "#3a8a30",
  padLight: "#56b048",
  padShine: "#82d46e",
  padDark: "#236020",
  petalWhite: "#fff6f8",
  petalPale: "#ffd9e4",
  petalPink: "#f993b4",
  petalDark: "#e85890",
  petalDeep: "#c03468",
  pod: "#f5cf3e",
  podDot: "#b8932a",
} as const;

// Estanque — agua con destellos y fondo de barro
function WaterBase() {
  return (
    <>
      {px(0, 13, 28, 1, C.waterLight)}
      {px(0, 14, 28, 2, C.waterMid)}
      {px(0, 16, 28, 2, C.waterDeep)}
      {/* destellos */}
      {px(2, 13, 3, 1, C.waterShine)}
      {px(9, 13, 2, 1, C.waterFoam)}
      {px(17, 13, 3, 1, C.waterShine)}
      {px(23, 13, 2, 1, C.waterFoam)}
      {px(5, 15, 3, 1, C.waterShallow)}
      {px(19, 15, 3, 1, C.waterShallow)}
      {/* barro */}
      {px(0, 18, 28, 2, C.mud)}
      {px(0, 18, 28, 1, C.mudLight)}
      {px(3, 19, 3, 1, C.mudDark)}
      {px(13, 19, 4, 1, C.mudDark)}
      {px(22, 19, 3, 1, C.mudDark)}
    </>
  );
}

// Nenúfar flotando — muesca en V al frente
function Pad(x: number, w: number) {
  const notch = x + Math.floor(w / 2);
  return (
    <>
      {px(x + 1, 12, w - 2, 1, C.padLight)}
      {px(x + 2, 12, 2, 1, C.padShine)}
      {px(x, 13, w, 1, C.padMid)}
      {px(x, 13, 1, 1, C.padDark)}
      {px(x + w - 1, 13, 1, 1, C.padDark)}
      {px(notch, 13, 1, 1, C.waterLight)}
    </>
  );
}

// Tallo — verde sobre el agua, oscuro por debajo
function Stalk(x: number, topY: number) {
  const rects = [];
  for (let y = topY; y <= 12; y++) rects.push(px(x, y, 1, 1, C.stem));
  for (let y = 14; y <= 17; y++) rects.push(px(x, y, 1, 1, C.stemUnder));
  return <>{rects}</>;
}

// Capullo puntiagudo — 3 de ancho, 4 de alto
function LotusBud(x: number, y: number) {
  return (
    <>
      {px(x + 1, y, 1, 1, C.petalPale)}
      {px(x, y + 1, 3, 1, C.petalPink)}
      {px(x, y + 2, 3, 1, C.petalPink)}
      {px(x + 1, y + 2, 1, 1, C.petalPale)}
      {px(x, y + 3, 3, 1, C.petalDark)}
    </>
  );
}

// Flor abierta — caja 10×7, pétalos puntiagudos y receptáculo dorado
function LotusFlower(x: number, y: number) {
  return (
    <>
      {px(x + 4, y, 2, 1, C.petalPale)}
      {px(x + 2, y + 1, 1, 1, C.petalPink)}
      {px(x + 3, y + 1, 4, 1, C.petalPale)}
      {px(x + 7, y + 1, 1, 1, C.petalPink)}
      {px(x + 1, y + 2, 2, 1, C.petalPink)}
      {px(x + 3, y + 2, 4, 1, C.petalWhite)}
      {px(x + 7, y + 2, 2, 1, C.petalPink)}
      {px(x, y + 3, 2, 1, C.petalDark)}
      {px(x + 2, y + 3, 2, 1, C.petalPink)}
      {px(x + 4, y + 3, 2, 1, C.petalWhite)}
      {px(x + 6, y + 3, 2, 1, C.petalPink)}
      {px(x + 8, y + 3, 2, 1, C.petalDark)}
      {px(x, y + 4, 1, 1, C.petalDeep)}
      {px(x + 1, y + 4, 2, 1, C.petalDark)}
      {px(x + 3, y + 4, 4, 1, C.pod)}
      {px(x + 4, y + 4, 1, 1, C.podDot)}
      {px(x + 6, y + 4, 1, 1, C.podDot)}
      {px(x + 7, y + 4, 2, 1, C.petalDark)}
      {px(x + 9, y + 4, 1, 1, C.petalDeep)}
      {px(x + 1, y + 5, 8, 1, C.petalDark)}
      {px(x + 2, y + 6, 6, 1, C.petalDeep)}
    </>
  );
}

// ── Stages ───────────────────────────────────────────────────────────────────
export function LotusStage1() {
  // Brote lanza rompiendo la superficie
  return (
    <>
      <WaterBase />
      {px(13, 9, 1, 1, C.stemLight)}
      {px(13, 10, 1, 3, C.stem)}
      {px(13, 14, 1, 4, C.stemUnder)}
      {/* ondas */}
      {px(11, 13, 2, 1, C.waterFoam)}
      {px(15, 13, 2, 1, C.waterFoam)}
    </>
  );
}

export function LotusStage2() {
  // Primer nenúfar
  return (
    <>
      <WaterBase />
      {px(13, 14, 1, 4, C.stemUnder)}
      {Pad(10, 6)}
      {px(17, 10, 1, 1, C.stemLight)}
      {px(17, 11, 1, 2, C.stem)}
      {px(17, 14, 1, 3, C.stemUnder)}
    </>
  );
}

export function LotusStage3() {
  // Dos nenúfares y brote central
  return (
    <>
      <WaterBase />
      {px(7, 14, 1, 4, C.stemUnder)}
      {px(20, 14, 1, 4, C.stemUnder)}
      {Pad(4, 7)}
      {Pad(17, 6)}
      {px(13, 9, 1, 1, C.stemLight)}
      {px(13, 10, 1, 3, C.stem)}
      {px(13, 14, 1, 4, C.stemUnder)}
    </>
  );
}

export function LotusStage4() {
  // Capullo bajo sobre el agua
  return (
    <>
      <WaterBase />
      {px(7, 14, 1, 4, C.stemUnder)}
      {px(21, 14, 1, 4, C.stemUnder)}
      {Pad(4, 7)}
      {Pad(19, 6)}
      {Stalk(13, 8)}
      {LotusBud(12, 4)}
    </>
  );
}

export function LotusStage5() {
  // Capullo más alto y tercer nenúfar
  return (
    <>
      <WaterBase />
      {px(7, 14, 1, 4, C.stemUnder)}
      {px(21, 14, 1, 4, C.stemUnder)}
      {px(11, 14, 1, 4, C.stemUnder)}
      {Pad(4, 7)}
      {Pad(19, 6)}
      {Pad(9, 5)}
      {Stalk(13, 6)}
      {LotusBud(12, 2)}
    </>
  );
}

export function LotusStage6() {
  // Capullo abriéndose — puntas separándose
  return (
    <>
      <WaterBase />
      {px(6, 14, 1, 4, C.stemUnder)}
      {px(21, 14, 1, 4, C.stemUnder)}
      {px(10, 14, 1, 4, C.stemUnder)}
      {Pad(3, 7)}
      {Pad(19, 6)}
      {Pad(8, 5)}
      {Stalk(13, 6)}
      {/* capullo abriendo */}
      {px(12, 1, 1, 1, C.petalPale)}
      {px(15, 1, 1, 1, C.petalPale)}
      {px(11, 2, 2, 1, C.petalPink)}
      {px(13, 2, 2, 1, C.petalWhite)}
      {px(15, 2, 2, 1, C.petalPink)}
      {px(11, 3, 6, 1, C.petalPink)}
      {px(13, 3, 2, 1, C.petalWhite)}
      {px(12, 4, 4, 1, C.petalDark)}
      {px(12, 5, 4, 1, C.petalDeep)}
    </>
  );
}

export function LotusStage7() {
  // Flor abierta
  return (
    <>
      <WaterBase />
      {px(5, 14, 1, 4, C.stemUnder)}
      {px(22, 14, 1, 4, C.stemUnder)}
      {Pad(2, 7)}
      {Pad(20, 6)}
      {Stalk(13, 10)}
      {LotusFlower(9, 3)}
    </>
  );
}

export function LotusStage8() {
  // Flor plena con capullo acompañante
  return (
    <>
      <WaterBase />
      {px(4, 14, 1, 4, C.stemUnder)}
      {px(22, 14, 1, 4, C.stemUnder)}
      {px(10, 14, 1, 4, C.stemUnder)}
      {Pad(1, 7)}
      {Pad(20, 6)}
      {Pad(8, 5)}
      {Stalk(13, 9)}
      {LotusFlower(9, 2)}
      {/* capullo lateral */}
      {Stalk(5, 10)}
      {LotusBud(4, 6)}
    </>
  );
}

export function LotusStage9() {
  // Loto sagrado — flor grande, capullo y estanque lleno de vida
  return (
    <>
      <WaterBase />
      {px(3, 14, 1, 4, C.stemUnder)}
      {px(23, 14, 1, 4, C.stemUnder)}
      {px(10, 14, 1, 4, C.stemUnder)}
      {Pad(0, 7)}
      {Pad(21, 7)}
      {Pad(8, 5)}
      {Pad(16, 5)}
      {Stalk(13, 8)}
      {LotusFlower(9, 1)}
      {/* pétalos exteriores extra */}
      {px(7, 4, 2, 1, C.petalDark)}
      {px(19, 4, 2, 1, C.petalDark)}
      {/* capullo lateral */}
      {Stalk(5, 9)}
      {LotusBud(4, 5)}
      {/* destellos de vida */}
      {px(6, 2, 1, 1, C.waterFoam)}
      {px(21, 1, 1, 1, C.waterFoam)}
      {px(24, 7, 1, 1, C.waterFoam)}
    </>
  );
}

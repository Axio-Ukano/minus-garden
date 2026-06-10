/* eslint-disable react-refresh/only-export-components -- sprite-parts module: exports the packet registry alongside the packet components */
// ─── Seed packet sprites ──────────────────────────────────────────────────────
// One packet per species for the future shop feature (not rendered in-app yet).
// All packets share the SAME pouch base on a 24×28 grid: a pinched crimp seal,
// a creased paper face with a plastic sheen, an accent band, and a dog-eared
// bottom-right corner. Each species is distinguished only by its band color and
// a small bloom emblem drawn with that species' palette (sourced from the
// matching <species>Stages file).

import type { JSX } from "react";
import { px } from "../shared/PotSprite";

export const PACKET_GRID = { w: 24, h: 28 } as const;

// Shared paper palette — outline matches the pot outline for set consistency.
const P = {
  outline: "#3a2317",
  paper: "#efe3cc",
  paperHi: "#f9f1e2",
  paperDark: "#d8c6a6",
  crimp: "#c2ab82",
} as const;

/**
 * Shared pouch body. The seal (x=3..20) is pinched narrower than the body
 * (x=1..22); the bottom-right corner is folded over, exposing unprinted paper
 * on top of the band. Emblems draw on y=6..16, centered on x=11..12.
 */
function PacketBase({ band, bandDark }: { band: string; bandDark: string }) {
  return (
    <>
      {/* crimp seal — pinched top */}
      {px(4, 0, 16, 1, P.outline)}
      {px(3, 1, 1, 3, P.outline)}
      {px(20, 1, 1, 3, P.outline)}
      {px(4, 1, 16, 2, P.paperDark)}
      {px(5, 1, 1, 2, P.crimp)}
      {px(8, 1, 1, 2, P.crimp)}
      {px(11, 1, 1, 2, P.crimp)}
      {px(14, 1, 1, 2, P.crimp)}
      {px(17, 1, 1, 2, P.crimp)}
      {px(4, 3, 16, 1, P.paper)}
      {/* shoulders — body flares out below the seal */}
      {px(1, 4, 3, 1, P.outline)}
      {px(20, 4, 3, 1, P.outline)}
      {px(4, 4, 16, 1, P.paperHi)}
      {/* body outline (bottom-left corner rounded, bottom-right folded) */}
      {px(1, 5, 1, 22, P.outline)}
      {px(22, 5, 1, 18, P.outline)}
      {px(2, 27, 16, 1, P.outline)}
      {px(22, 23, 1, 1, P.outline)}
      {px(21, 24, 1, 1, P.outline)}
      {px(20, 25, 1, 1, P.outline)}
      {px(19, 26, 1, 1, P.outline)}
      {px(18, 27, 1, 1, P.outline)}
      {/* paper face with side shading and a shadow where the band starts */}
      {px(2, 5, 20, 15, P.paper)}
      {px(2, 5, 1, 15, P.paperHi)}
      {px(21, 5, 1, 15, P.paperDark)}
      {px(2, 20, 20, 1, P.paperDark)}
      {px(21, 20, 1, 1, P.crimp)}
      {/* plastic sheen */}
      {px(18, 5, 1, 2, P.paperHi)}
      {px(17, 7, 1, 2, P.paperHi)}
      {/* soft vertical crease */}
      {px(5, 6, 1, 5, P.paperDark)}
      {px(5, 13, 1, 5, P.paperDark)}
      {/* loose seeds */}
      {px(9, 17, 1, 1, P.paperDark)}
      {px(12, 18, 1, 1, P.paperDark)}
      {px(16, 17, 1, 1, P.paperDark)}
      {/* accent band — rows shorten where the fold cuts the corner */}
      {px(2, 21, 20, 3, band)}
      {px(2, 24, 19, 1, band)}
      {px(2, 25, 18, 1, band)}
      {px(2, 26, 16, 1, bandDark)}
      {px(21, 21, 1, 2, bandDark)}
      {/* dog-eared corner — unprinted paper folded over the band */}
      {px(18, 22, 4, 1, bandDark)}
      {px(17, 23, 1, 4, bandDark)}
      {px(18, 23, 3, 1, P.paperHi)}
      {px(18, 24, 2, 1, P.paperHi)}
      {px(18, 25, 1, 1, P.paperHi)}
      {px(21, 23, 1, 1, P.paper)}
      {px(20, 24, 1, 1, P.paper)}
      {px(19, 25, 1, 1, P.paper)}
      {px(18, 26, 1, 1, P.paper)}
    </>
  );
}

// ─── Packets ─────────────────────────────────────────────────────────────────

export function DaisySeedPacket() {
  return (
    <>
      <PacketBase band="#fdfbf6" bandDark="#e8dcc8" />
      {/* white cross petals around a yellow disc */}
      {px(11, 8, 2, 2, "#fdfbf6")}
      {px(11, 8, 2, 1, "#ffffff")}
      {px(11, 12, 2, 2, "#fdfbf6")}
      {px(11, 13, 2, 1, "#e8dcc8")}
      {px(9, 10, 2, 2, "#fdfbf6")}
      {px(13, 10, 2, 2, "#fdfbf6")}
      {px(10, 9, 1, 1, "#fdfbf6")}
      {px(13, 9, 1, 1, "#fdfbf6")}
      {px(10, 12, 1, 1, "#fdfbf6")}
      {px(13, 12, 1, 1, "#fdfbf6")}
      {px(11, 10, 2, 2, "#f8c838")}
      {px(12, 11, 1, 1, "#cf9412")}
    </>
  );
}

export function SunflowerSeedPacket() {
  return (
    <>
      <PacketBase band="#f8c830" bandDark="#d89610" />
      {/* broad golden ring around a brown disc */}
      {px(11, 7, 2, 3, "#f8c830")}
      {px(11, 7, 2, 1, "#ffe066")}
      {px(11, 12, 2, 3, "#f8c830")}
      {px(8, 10, 3, 2, "#f8c830")}
      {px(13, 10, 3, 2, "#f8c830")}
      {px(10, 9, 1, 1, "#d89610")}
      {px(13, 9, 1, 1, "#d89610")}
      {px(10, 12, 1, 1, "#d89610")}
      {px(13, 12, 1, 1, "#d89610")}
      {px(11, 10, 2, 2, "#5a3618")}
      {px(11, 10, 1, 1, "#7a4e28")}
    </>
  );
}

export function GerberaSeedPacket() {
  return (
    <>
      <PacketBase band="#f57828" bandDark="#c44814" />
      {/* slim orange rays, dark eye */}
      {px(11, 8, 2, 2, "#f57828")}
      {px(11, 8, 2, 1, "#ff9d52")}
      {px(11, 12, 2, 2, "#f57828")}
      {px(11, 13, 2, 1, "#c44814")}
      {px(9, 10, 2, 2, "#f57828")}
      {px(13, 10, 2, 2, "#f57828")}
      {px(10, 9, 1, 1, "#f57828")}
      {px(13, 9, 1, 1, "#f57828")}
      {px(10, 12, 1, 1, "#f57828")}
      {px(13, 12, 1, 1, "#f57828")}
      {px(11, 10, 2, 2, "#7c3c16")}
    </>
  );
}

export function LavenderSeedPacket() {
  return (
    <>
      <PacketBase band="#9a6ac8" bandDark="#6a4292" />
      {/* purple spike on a leafy stem */}
      {px(11, 6, 2, 1, "#bc92e2")}
      {px(11, 7, 2, 1, "#9a6ac8")}
      {px(11, 8, 2, 1, "#6a4292")}
      {px(11, 9, 2, 1, "#9a6ac8")}
      {px(11, 10, 2, 1, "#6a4292")}
      {px(11, 11, 2, 1, "#9a6ac8")}
      {px(10, 8, 1, 1, "#bc92e2")}
      {px(13, 10, 1, 1, "#bc92e2")}
      {px(11, 12, 2, 4, "#5a7a4c")}
      {px(9, 13, 2, 1, "#6e9460")}
      {px(13, 14, 2, 1, "#6e9460")}
    </>
  );
}

export function CarnationSeedPacket() {
  return (
    <>
      <PacketBase band="#e84864" bandDark="#9a1428" />
      {/* ruffled red bloom over a green calyx */}
      {px(9, 7, 1, 1, "#f87890")}
      {px(11, 7, 1, 1, "#ffaebc")}
      {px(13, 7, 1, 1, "#f87890")}
      {px(9, 8, 6, 1, "#f87890")}
      {px(9, 9, 6, 2, "#e84864")}
      {px(10, 9, 1, 1, "#ffaebc")}
      {px(13, 10, 1, 1, "#f87890")}
      {px(10, 11, 4, 1, "#d22440")}
      {px(10, 12, 1, 1, "#2e5440")}
      {px(13, 12, 1, 1, "#2e5440")}
      {px(11, 12, 2, 2, "#4a7a58")}
      {px(11, 14, 2, 1, "#2e5440")}
    </>
  );
}

export function IrisSeedPacket() {
  return (
    <>
      <PacketBase band="#6a48cc" bandDark="#4c2ea0" />
      {/* lilac standards up, violet falls down, yellow beard */}
      {px(11, 7, 2, 2, "#c8aeff")}
      {px(11, 7, 2, 1, "#e2d6ff")}
      {px(10, 9, 4, 2, "#8462e0")}
      {px(11, 11, 2, 1, "#f8c838")}
      {px(9, 11, 2, 2, "#6a48cc")}
      {px(13, 11, 2, 2, "#6a48cc")}
      {px(9, 12, 1, 1, "#4c2ea0")}
      {px(14, 12, 1, 1, "#4c2ea0")}
    </>
  );
}

export function PeonySeedPacket() {
  return (
    <>
      <PacketBase band="#f87ea6" bandDark="#c02858" />
      {/* dense layered pink bloom */}
      {px(11, 7, 2, 1, "#f87ea6")}
      {px(10, 8, 4, 1, "#f87ea6")}
      {px(10, 8, 2, 1, "#ffaec8")}
      {px(9, 9, 6, 3, "#e84e80")}
      {px(9, 9, 1, 3, "#f87ea6")}
      {px(10, 9, 2, 2, "#ffaec8")}
      {px(10, 9, 1, 1, "#ffd6e2")}
      {px(14, 9, 1, 3, "#c02858")}
      {px(10, 12, 4, 1, "#c02858")}
      {px(12, 12, 2, 1, "#a01c48")}
    </>
  );
}

export function CactusSeedPacket() {
  return (
    <>
      <PacketBase band="#2f7e3c" bandDark="#1e5c28" />
      {/* saguaro silhouette with two arms and pale spines */}
      {px(11, 7, 2, 1, "#48a456")}
      {px(10, 8, 4, 8, "#2f7e3c")}
      {px(10, 8, 1, 8, "#48a456")}
      {px(13, 8, 1, 8, "#1e5c28")}
      {px(8, 9, 1, 3, "#2f7e3c")}
      {px(8, 9, 1, 1, "#48a456")}
      {px(9, 11, 1, 1, "#2f7e3c")}
      {px(15, 10, 1, 3, "#2f7e3c")}
      {px(15, 10, 1, 1, "#48a456")}
      {px(14, 12, 1, 1, "#2f7e3c")}
      {px(11, 9, 1, 1, "#f2f2d8")}
      {px(12, 11, 1, 1, "#f2f2d8")}
      {px(11, 13, 1, 1, "#f2f2d8")}
    </>
  );
}

export function OrchidSeedPacket() {
  return (
    <>
      <PacketBase band="#e03898" bandDark="#a8246e" />
      {/* white moth petals, lilac crown, magenta lip */}
      {px(11, 7, 2, 2, "#b88ce0")}
      {px(11, 7, 2, 1, "#d8b8f0")}
      {px(9, 9, 2, 2, "#faf4ff")}
      {px(13, 9, 2, 2, "#faf4ff")}
      {px(9, 10, 2, 1, "#d8b8f0")}
      {px(13, 10, 2, 1, "#d8b8f0")}
      {px(11, 9, 2, 1, "#f8d048")}
      {px(11, 10, 2, 1, "#e03898")}
      {px(11, 11, 2, 1, "#a8246e")}
    </>
  );
}

export function LotusSeedPacket() {
  return (
    <>
      <PacketBase band="#3a6fc0" bandDark="#1c3f74" />
      {/* pink bloom floating over a water line */}
      {px(11, 7, 2, 4, "#ffd9e4")}
      {px(11, 7, 2, 1, "#fff6f8")}
      {px(9, 9, 2, 2, "#f993b4")}
      {px(13, 9, 2, 2, "#f993b4")}
      {px(8, 10, 1, 1, "#e85890")}
      {px(15, 10, 1, 1, "#e85890")}
      {px(10, 11, 4, 1, "#c03468")}
      {px(8, 13, 8, 1, "#3a6fc0")}
      {px(9, 13, 2, 1, "#7fb0ee")}
      {px(14, 13, 1, 1, "#7fb0ee")}
    </>
  );
}

// ── Species → packet map — IDs match plantService/DB values, do not change ───
export const SEED_PACKET_SPRITES: Record<string, () => JSX.Element> = {
  daisy: DaisySeedPacket,
  sunflower: SunflowerSeedPacket,
  gerbera: GerberaSeedPacket,
  lavanda: LavenderSeedPacket,
  clavel: CarnationSeedPacket,
  lirio: IrisSeedPacket,
  peonia: PeonySeedPacket,
  cactus: CactusSeedPacket,
  orquidea: OrchidSeedPacket,
  lotus: LotusSeedPacket,
};

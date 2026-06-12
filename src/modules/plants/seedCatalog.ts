// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Seed catalog — shop economy rules ───────────────────────────────────────
// Prices and tiers for every plantable species. Like calculateHeartsEarned,
// this is a game rule with a single source of truth (ADR-0007): the shop UI,
// the timer's locked-plant states and any future garden feature all read from
// here. Prices are denominated in hearts (1 heart = 5 minutes of study), so a
// listing's price is also a statement of how much study it represents.
//
// Balancing intent (first economy pass):
// - The daisy is the starter — every garden begins with one, free.
// - The first purchase (gerbera, 10 ♥) lands after ~2 classic sessions.
// - The full collection costs 440 ♥ ≈ 37 hours of study: a long-haul goal
//   that accumulates naturally over weeks, not a grind wall.
// - Price grows roughly with growth time: slower bloomers are pricier.

export type SeedTier = "starter" | "common" | "uncommon" | "rare" | "exotic";

export interface SeedListing {
  speciesId: string;
  /** Cost in hearts. 0 only for the starter. */
  price: number;
  tier: SeedTier;
}

/** Canonical shop order: starter first, then by ascending price. */
export const SEED_CATALOG: SeedListing[] = [
  { speciesId: "daisy", price: 0, tier: "starter" },
  { speciesId: "gerbera", price: 10, tier: "common" },
  { speciesId: "lavanda", price: 15, tier: "common" },
  { speciesId: "clavel", price: 20, tier: "uncommon" },
  { speciesId: "lirio", price: 30, tier: "uncommon" },
  { speciesId: "sunflower", price: 45, tier: "uncommon" },
  { speciesId: "peonia", price: 55, tier: "rare" },
  { speciesId: "cactus", price: 70, tier: "rare" },
  { speciesId: "orquidea", price: 85, tier: "exotic" },
  { speciesId: "lotus", price: 110, tier: "exotic" },
];

const CATALOG_BY_ID = new Map(SEED_CATALOG.map((listing) => [listing.speciesId, listing]));

const FALLBACK_LISTING: SeedListing = SEED_CATALOG[0] ?? {
  speciesId: "daisy",
  price: 0,
  tier: "starter",
};

/** Listing for a species; falls back to the starter for unknown ids. */
export function getSeedListing(speciesId: string): SeedListing {
  return CATALOG_BY_ID.get(speciesId) ?? FALLBACK_LISTING;
}

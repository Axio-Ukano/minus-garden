// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect } from "vitest";
import { SEED_CATALOG, getSeedListing, type SeedTier } from "./seedCatalog";
import { ALL_SPECIES } from "./plantService";

const VALID_TIERS: SeedTier[] = ["starter", "common", "uncommon", "rare", "exotic"];

describe("SEED_CATALOG", () => {
  it("contains exactly one listing per species in ALL_SPECIES and vice versa", () => {
    const catalogIds = SEED_CATALOG.map((l) => l.speciesId).sort();
    const speciesIds = ALL_SPECIES.map((s) => s.id).sort();
    expect(catalogIds).toEqual(speciesIds);
  });

  it("daisy is the only price-0 starter listing", () => {
    const starters = SEED_CATALOG.filter((l) => l.price === 0);
    expect(starters).toHaveLength(1);
    expect(starters[0]!.speciesId).toBe("daisy");
    expect(starters[0]!.tier).toBe("starter");
  });

  it("all non-daisy listings have a price > 0", () => {
    const paid = SEED_CATALOG.filter((l) => l.speciesId !== "daisy");
    for (const listing of paid) {
      expect(listing.price).toBeGreaterThan(0);
    }
  });

  it("catalog is sorted ascending by price", () => {
    for (let i = 1; i < SEED_CATALOG.length; i++) {
      expect(SEED_CATALOG[i]!.price).toBeGreaterThanOrEqual(SEED_CATALOG[i - 1]!.price);
    }
  });

  it("every tier is one of the 5 valid tiers", () => {
    for (const listing of SEED_CATALOG) {
      expect(VALID_TIERS).toContain(listing.tier);
    }
  });

  it("has no duplicate speciesIds", () => {
    const ids = SEED_CATALOG.map((l) => l.speciesId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getSeedListing", () => {
  it("returns the correct listing for every species in the catalog", () => {
    for (const listing of SEED_CATALOG) {
      const result = getSeedListing(listing.speciesId);
      expect(result).toEqual(listing);
    }
  });

  it("falls back to the daisy listing for an unknown id", () => {
    const fallback = getSeedListing("nonexistent-species-xyz");
    const daisy = getSeedListing("daisy");
    expect(fallback).toEqual(daisy);
    expect(fallback.speciesId).toBe("daisy");
    expect(fallback.price).toBe(0);
    expect(fallback.tier).toBe("starter");
  });

  it("falls back to the daisy listing for an empty string", () => {
    const fallback = getSeedListing("");
    expect(fallback.speciesId).toBe("daisy");
  });
});

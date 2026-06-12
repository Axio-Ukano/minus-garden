// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Inventory store ──────────────────────────────────────────────────────────
// Ownership state for everything purchasable. Deliberately its own module —
// the shop writes to it, while the timer (and the future garden) only read
// from it, so neither needs to depend on the other's UI.

import { create } from "zustand";
import { repository, type InventoryItem, type PurchaseOutcome } from "@/lib/data";
import { useHistoryStore } from "@/modules/history";
import { getSeedListing } from "@/modules/plants";

interface InventoryState {
  items: InventoryItem[];
  /** Species ids of owned seeds — derived from `items`, kept for O(1) lookups. */
  ownedSeedIds: ReadonlySet<string>;
  loaded: boolean;
  purchasing: boolean;
  loadInventory: () => Promise<void>;
  /**
   * Buy a seed at its catalog price. Resolves with the purchase outcome, or
   * `null` on failure (the transport has already surfaced a localized toast).
   */
  purchaseSeed: (speciesId: string) => Promise<PurchaseOutcome | null>;
  ownsSeed: (speciesId: string) => boolean;
}

function seedIdsOf(items: InventoryItem[]): ReadonlySet<string> {
  return new Set(items.filter((item) => item.kind === "seed").map((item) => item.itemId));
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  ownedSeedIds: new Set<string>(),
  loaded: false,
  purchasing: false,

  loadInventory: async () => {
    try {
      const items = await repository.inventory.list();
      set({ items, ownedSeedIds: seedIdsOf(items), loaded: true });
    } catch (e) {
      // Toast already surfaced by the repository transport; keep last known
      // ownership (the starter daisy is guaranteed by ownsSeed's fallback).
      console.error("[inventoryStore.loadInventory]", e);
    }
  },

  purchaseSeed: async (speciesId: string) => {
    if (get().purchasing || get().ownsSeed(speciesId)) return null;
    const { price } = getSeedListing(speciesId);
    set({ purchasing: true });
    try {
      const outcome = await repository.inventory.purchase("seed", speciesId, price);
      const items = [...get().items, outcome.item];
      set({ items, ownedSeedIds: seedIdsOf(items), purchasing: false });
      // The backend deducted the hearts in the same transaction — adopt the
      // returned balance instead of recomputing it client-side.
      useHistoryStore.getState().applyHeartsBalance(outcome.totalHearts);
      return outcome;
    } catch (e) {
      set({ purchasing: false });
      console.error("[inventoryStore.purchaseSeed]", e);
      return null;
    }
  },

  // The daisy is the starter species: treat it as owned even before the first
  // inventory load resolves, so the timer never blocks the default selection.
  ownsSeed: (speciesId: string) => speciesId === "daisy" || get().ownedSeedIds.has(speciesId),
}));

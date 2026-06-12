// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, vi } from "vitest";

// ─── Hoist mock factories before any imports that use them ───────────────────
const { inventoryListMock, inventoryPurchaseMock } = vi.hoisted(() => ({
  inventoryListMock: vi.fn(),
  inventoryPurchaseMock: vi.fn(),
}));

vi.mock("@/lib/data", () => ({
  repository: {
    inventory: {
      list: inventoryListMock,
      purchase: inventoryPurchaseMock,
    },
  },
}));

import { useInventoryStore } from "./inventoryStore";
import { useHistoryStore } from "@/modules/history";
import type { InventoryItem } from "@/lib/data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
  return {
    id: `item-${Date.now()}-${Math.random()}`,
    kind: "seed",
    itemId: "gerbera",
    acquiredAt: new Date().toISOString(),
    ...overrides,
  };
}

const initialInventory = useInventoryStore.getState();
const initialHistory = useHistoryStore.getState();

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("inventoryStore", () => {
  beforeEach(() => {
    inventoryListMock.mockReset();
    inventoryPurchaseMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});

    // Reset inventory store to pristine state.
    useInventoryStore.setState({
      items: [],
      ownedSeedIds: new Set<string>(),
      loaded: false,
      purchasing: false,
      loadInventory: initialInventory.loadInventory,
      purchaseSeed: initialInventory.purchaseSeed,
      ownsSeed: initialInventory.ownsSeed,
    });

    // Reset history store so totalHearts is predictable.
    useHistoryStore.setState({
      sessions: [],
      totalHearts: 0,
      loading: false,
      error: null,
      loadSessions: initialHistory.loadSessions,
      loadUserState: initialHistory.loadUserState,
      saveSession: initialHistory.saveSession,
      deleteSession: initialHistory.deleteSession,
      syncHearts: initialHistory.syncHearts,
      addHearts: initialHistory.addHearts,
      applyHeartsBalance: initialHistory.applyHeartsBalance,
    });
  });

  // ─── loadInventory ─────────────────────────────────────────────────────────

  describe("loadInventory", () => {
    it("populates items, ownedSeedIds, and marks loaded=true on success", async () => {
      const seedItem = makeItem({ kind: "seed", itemId: "gerbera" });
      inventoryListMock.mockResolvedValueOnce([seedItem]);

      await useInventoryStore.getState().loadInventory();

      const s = useInventoryStore.getState();
      expect(inventoryListMock).toHaveBeenCalledOnce();
      expect(s.items).toEqual([seedItem]);
      expect(s.ownedSeedIds.has("gerbera")).toBe(true);
      expect(s.loaded).toBe(true);
    });

    it("derives ownedSeedIds only from seed-kind items", async () => {
      const toolItem = makeItem({ kind: "tool", itemId: "watering-can" });
      inventoryListMock.mockResolvedValueOnce([toolItem]);

      await useInventoryStore.getState().loadInventory();

      const s = useInventoryStore.getState();
      expect(s.ownedSeedIds.has("watering-can")).toBe(false);
      expect(s.ownedSeedIds.size).toBe(0);
    });

    it("preserves last known state and does not set loaded=true on failure", async () => {
      inventoryListMock.mockRejectedValueOnce(new Error("DB error"));

      await useInventoryStore.getState().loadInventory();

      const s = useInventoryStore.getState();
      expect(s.items).toEqual([]);
      expect(s.loaded).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        "[inventoryStore.loadInventory]",
        expect.any(Error)
      );
    });
  });

  // ─── ownsSeed ──────────────────────────────────────────────────────────────

  describe("ownsSeed", () => {
    it("returns true for daisy even before any load", () => {
      expect(useInventoryStore.getState().ownsSeed("daisy")).toBe(true);
    });

    it("returns false for other species before load", () => {
      expect(useInventoryStore.getState().ownsSeed("gerbera")).toBe(false);
    });

    it("returns true for a seed that was loaded", async () => {
      const item = makeItem({ kind: "seed", itemId: "lotus" });
      inventoryListMock.mockResolvedValueOnce([item]);
      await useInventoryStore.getState().loadInventory();
      expect(useInventoryStore.getState().ownsSeed("lotus")).toBe(true);
    });
  });

  // ─── purchaseSeed ──────────────────────────────────────────────────────────

  describe("purchaseSeed", () => {
    it("calls repository.inventory.purchase with (seed, speciesId, catalogPrice) and returns the outcome", async () => {
      // gerbera catalog price = 10
      const newItem = makeItem({ kind: "seed", itemId: "gerbera" });
      const outcome = { totalHearts: 40, item: newItem };
      inventoryPurchaseMock.mockResolvedValueOnce(outcome);

      useHistoryStore.setState({ totalHearts: 50 });

      const result = await useInventoryStore.getState().purchaseSeed("gerbera");

      expect(inventoryPurchaseMock).toHaveBeenCalledWith("seed", "gerbera", 10);
      expect(result).toEqual(outcome);
    });

    it("updates items and ownedSeedIds on success", async () => {
      const newItem = makeItem({ kind: "seed", itemId: "lavanda" });
      inventoryPurchaseMock.mockResolvedValueOnce({ totalHearts: 35, item: newItem });

      await useInventoryStore.getState().purchaseSeed("lavanda");

      const s = useInventoryStore.getState();
      expect(s.items).toContainEqual(newItem);
      expect(s.ownedSeedIds.has("lavanda")).toBe(true);
      expect(s.purchasing).toBe(false);
    });

    it("applies the returned heart balance to useHistoryStore", async () => {
      const newItem = makeItem({ kind: "seed", itemId: "clavel" });
      inventoryPurchaseMock.mockResolvedValueOnce({ totalHearts: 30, item: newItem });

      useHistoryStore.setState({ totalHearts: 50 });
      await useInventoryStore.getState().purchaseSeed("clavel");

      expect(useHistoryStore.getState().totalHearts).toBe(30);
    });

    it("returns null and leaves ownedSeedIds unchanged when repository rejects", async () => {
      inventoryPurchaseMock.mockRejectedValueOnce(new Error("Not enough hearts"));

      const result = await useInventoryStore.getState().purchaseSeed("gerbera");

      expect(result).toBeNull();
      expect(useInventoryStore.getState().ownedSeedIds.has("gerbera")).toBe(false);
      expect(useInventoryStore.getState().purchasing).toBe(false);
    });

    it("leaves the heart balance untouched when the purchase is rejected (atomic)", async () => {
      // 5 hearts, gerbera costs 10 — the backend rejects and must not have
      // charged anything. The store adopts the backend balance only on success,
      // so a rejection must leave totalHearts exactly where it was.
      useHistoryStore.setState({ totalHearts: 5 });
      inventoryPurchaseMock.mockRejectedValueOnce(new Error("Not enough hearts"));

      const result = await useInventoryStore.getState().purchaseSeed("gerbera");

      expect(result).toBeNull();
      expect(inventoryPurchaseMock).toHaveBeenCalledTimes(1);
      expect(useInventoryStore.getState().ownedSeedIds.has("gerbera")).toBe(false);
      expect(useHistoryStore.getState().totalHearts).toBe(5);
    });

    it("returns null without calling repository when speciesId is already owned", async () => {
      // Load gerbera into owned set first.
      const item = makeItem({ kind: "seed", itemId: "gerbera" });
      inventoryListMock.mockResolvedValueOnce([item]);
      await useInventoryStore.getState().loadInventory();

      const result = await useInventoryStore.getState().purchaseSeed("gerbera");

      expect(result).toBeNull();
      expect(inventoryPurchaseMock).not.toHaveBeenCalled();
    });

    it("returns null without calling repository for daisy (always owned)", async () => {
      const result = await useInventoryStore.getState().purchaseSeed("daisy");

      expect(result).toBeNull();
      expect(inventoryPurchaseMock).not.toHaveBeenCalled();
    });

    it("resets purchasing to false after failure", async () => {
      inventoryPurchaseMock.mockRejectedValueOnce(new Error("Item already owned"));

      await useInventoryStore.getState().purchaseSeed("lirio");

      expect(useInventoryStore.getState().purchasing).toBe(false);
    });
  });
});

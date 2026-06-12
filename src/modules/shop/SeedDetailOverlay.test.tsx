// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { SeedDetailOverlay } from "./SeedDetailOverlay";
import { useInventoryStore } from "@/modules/inventory";
import { useHistoryStore } from "@/modules/history";
import { useSettingsStore } from "@/modules/settings";

// The purchase tests swap the store action for a spy; restore the real one
// so this file never leaks a mock into its own later tests.
const realPurchaseSeed = useInventoryStore.getState().purchaseSeed;

function renderDetail(speciesId: string) {
  return render(<SeedDetailOverlay speciesId={speciesId} onClose={vi.fn()} />);
}

function stageSvgs(container: HTMLElement): SVGSVGElement[] {
  return Array.from(container.querySelectorAll(".shop-detail__stage svg"));
}

function stageEls(container: HTMLElement): Element[] {
  return Array.from(container.querySelectorAll(".shop-detail__stage"));
}

beforeEach(() => {
  useInventoryStore.setState({
    ownedSeedIds: new Set<string>(),
    purchasing: false,
    purchaseSeed: realPurchaseSeed,
  });
  useHistoryStore.setState({ totalHearts: 0 });
});

describe("SeedDetailOverlay growth preview", () => {
  it("renders one sprite per growth stage", () => {
    const daisy = renderDetail("daisy");
    expect(stageSvgs(daisy.container)).toHaveLength(5);
    daisy.unmount();

    const lotus = renderDetail("lotus");
    expect(stageSvgs(lotus.container)).toHaveLength(9);
  });

  it("previews every species at the same md sprite scale — long filmstrips never drop to a smaller bucket", () => {
    // md = 64px on the sprite's longer axis, regardless of stage count.
    for (const speciesId of ["daisy", "sunflower", "orquidea", "lotus"]) {
      const { container, unmount } = renderDetail(speciesId);
      const svgs = stageSvgs(container);
      expect(svgs.length).toBeGreaterThan(0);
      for (const svg of svgs) {
        const longerAxis = Math.max(
          Number(svg.getAttribute("width")),
          Number(svg.getAttribute("height"))
        );
        expect(longerAxis).toBe(64);
      }
      unmount();
    }
  });

  it("keeps stages silhouetted with a hint until the seed is owned", () => {
    const { container } = renderDetail("lotus");
    const stages = stageEls(container);
    // Length guard: an empty query must fail loudly, not pass vacuously.
    expect(stages).toHaveLength(9);
    for (const stage of stages) {
      expect(stage.className).toContain("shop-detail__stage--hidden");
    }
    expect(container.querySelector(".shop-detail__preview-hint")).not.toBeNull();
  });

  it("reveals the growth stages once the seed is owned", () => {
    useInventoryStore.setState({ ownedSeedIds: new Set(["lotus"]) });
    const { container } = renderDetail("lotus");
    const stages = stageEls(container);
    expect(stages).toHaveLength(9);
    for (const stage of stages) {
      expect(stage.className).not.toContain("shop-detail__stage--hidden");
    }
    expect(container.querySelector(".shop-detail__preview-hint")).toBeNull();
  });
});

describe("SeedDetailOverlay purchase interaction", () => {
  afterEach(() => {
    useSettingsStore.setState({ masterMuted: false });
    vi.useRealTimers();
  });

  it("does not arm or re-fire while a purchase is already in flight", () => {
    useHistoryStore.setState({ totalHearts: 50 });
    const spy = vi.fn();
    useInventoryStore.setState({ purchasing: true, purchaseSeed: spy });

    const { getByTestId, queryByTestId } = renderDetail("gerbera");
    fireEvent.click(getByTestId("shop-buy"));

    expect(queryByTestId("shop-confirm")).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it("arms on the first click and quietly disarms after the timeout", () => {
    vi.useFakeTimers();
    useHistoryStore.setState({ totalHearts: 50 });

    const { getByTestId, queryByTestId } = renderDetail("gerbera");
    fireEvent.click(getByTestId("shop-buy"));
    expect(getByTestId("shop-confirm")).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(3600);
    });
    expect(queryByTestId("shop-confirm")).toBeNull();
    expect(getByTestId("shop-buy")).toBeDefined();
  });

  it("confirming the purchase reveals the growth stages and the grow action", async () => {
    useHistoryStore.setState({ totalHearts: 50 });
    // Mute sfx so the purchase path never touches real audio in jsdom.
    useSettingsStore.setState({ masterMuted: true });

    const purchaseSeed = vi.fn(async (speciesId: string) => {
      useInventoryStore.setState({ ownedSeedIds: new Set([speciesId]) });
      return {
        totalHearts: 40,
        item: { id: "t1", kind: "seed" as const, itemId: speciesId, acquiredAt: "" },
      };
    });
    useInventoryStore.setState({ purchaseSeed });

    const { container, getByTestId, findByTestId } = renderDetail("gerbera");
    fireEvent.click(getByTestId("shop-buy"));
    fireEvent.click(getByTestId("shop-confirm"));

    await findByTestId("shop-grow");
    expect(purchaseSeed).toHaveBeenCalledExactlyOnceWith("gerbera");

    const stages = stageEls(container);
    expect(stages.length).toBeGreaterThan(0);
    for (const stage of stages) {
      expect(stage.className).toContain("shop-detail__stage--reveal");
      expect(stage.className).not.toContain("shop-detail__stage--hidden");
    }
  });
});

// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { SeedDetailOverlay } from "./SeedDetailOverlay";
import { useInventoryStore } from "@/modules/inventory";
import { useHistoryStore } from "@/modules/history";

function renderDetail(speciesId: string) {
  return render(<SeedDetailOverlay speciesId={speciesId} onClose={vi.fn()} />);
}

function stageSvgs(container: HTMLElement): SVGSVGElement[] {
  return Array.from(container.querySelectorAll(".shop-detail__stage svg"));
}

describe("SeedDetailOverlay growth preview", () => {
  beforeEach(() => {
    useInventoryStore.setState({ ownedSeedIds: new Set<string>(), purchasing: false });
    useHistoryStore.setState({ totalHearts: 0 });
  });

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
    const stages = Array.from(container.querySelectorAll(".shop-detail__stage"));
    expect(stages.length).toBeGreaterThan(0);
    for (const stage of stages) {
      expect(stage.className).toContain("shop-detail__stage--hidden");
    }
    expect(container.querySelector(".shop-detail__preview-hint")).not.toBeNull();
  });

  it("reveals the growth stages once the seed is owned", () => {
    useInventoryStore.setState({ ownedSeedIds: new Set(["lotus"]) });
    const { container } = renderDetail("lotus");
    for (const stage of Array.from(container.querySelectorAll(".shop-detail__stage"))) {
      expect(stage.className).not.toContain("shop-detail__stage--hidden");
    }
    expect(container.querySelector(".shop-detail__preview-hint")).toBeNull();
  });
});

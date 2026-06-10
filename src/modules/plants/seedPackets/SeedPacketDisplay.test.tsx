import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SeedPacketDisplay } from "./SeedPacketDisplay";
import { SEED_PACKET_SPRITES } from "./SeedPacketSprites";
import { ALL_SPECIES } from "../plantService";

describe("SeedPacketSprites", () => {
  it("has a packet sprite for every registered species", () => {
    for (const species of ALL_SPECIES) {
      expect(SEED_PACKET_SPRITES[species.id], `missing packet for "${species.id}"`).toBeDefined();
    }
  });

  it("renders an svg for every species without crashing", () => {
    for (const species of ALL_SPECIES) {
      const { container, unmount } = render(<SeedPacketDisplay speciesId={species.id} />);
      expect(container.querySelector("svg"), `no svg for "${species.id}"`).not.toBeNull();
      unmount();
    }
  });

  it("falls back to the daisy packet for unknown species ids", () => {
    const { container } = render(<SeedPacketDisplay speciesId="unknown-species" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlantStagesModal } from "./PlantStagesModal";
import { DAISY_SPECIES } from "./plantService";

function setup() {
  const onClose = vi.fn();
  render(<PlantStagesModal isOpen onClose={onClose} species={DAISY_SPECIES} />);
  return { onClose };
}

describe("PlantStagesModal", () => {
  it("shows one card per growth stage", () => {
    setup();
    expect(screen.getByText("SEED")).toBeDefined();
    expect(screen.getByText("SPROUT")).toBeDefined();
    expect(screen.getByText("BUD")).toBeDefined();
  });

  it("opens the stage close-up when a card is clicked", () => {
    setup();
    fireEvent.click(screen.getByText("SPROUT"));
    // Header now shows the stage name and the plant·stage subtitle
    expect(screen.getByText("DAISY · STAGE 2/5")).toBeDefined();
  });

  it("Escape backs out of the close-up before closing the modal", () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByText("SPROUT"));

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.queryByText("DAISY · STAGE 2/5")).toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clicking the close-up returns to the stage grid", () => {
    setup();
    fireEvent.click(screen.getByText("SPROUT"));
    fireEvent.click(screen.getByRole("button", { name: /go back/i }));
    expect(screen.getByText("SEED")).toBeDefined();
  });

  it("arrows step between stages in the close-up", () => {
    setup();
    fireEvent.click(screen.getByText("SPROUT"));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText("DAISY · STAGE 3/5")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(screen.getByText("DAISY · STAGE 2/5")).toBeDefined();
  });

  it("arrow keys navigate stages while the close-up is open", () => {
    setup();
    fireEvent.click(screen.getByText("SPROUT"));
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByText("DAISY · STAGE 3/5")).toBeDefined();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("DAISY · STAGE 1/5")).toBeDefined();
    // Clamped at the first stage
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("DAISY · STAGE 1/5")).toBeDefined();
  });

  it("disables the arrows at the first and last stage", () => {
    setup();
    fireEvent.click(screen.getByText("SEED"));
    const prev = screen.getByRole("button", { name: /previous/i }) as HTMLButtonElement;
    const next = screen.getByRole("button", { name: /next/i }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);
    // Walk to the last stage
    for (let i = 0; i < 4; i++) fireEvent.click(next);
    expect(screen.getByText("DAISY · STAGE 5/5")).toBeDefined();
    expect(next.disabled).toBe(true);
  });
});

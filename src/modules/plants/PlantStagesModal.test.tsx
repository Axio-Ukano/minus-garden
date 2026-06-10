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
});

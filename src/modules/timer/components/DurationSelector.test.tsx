// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DurationSelector } from "./DurationSelector";

function setup(value: number) {
  const onChange = vi.fn();
  render(<DurationSelector value={value} onChange={onChange} />);
  return { onChange };
}

describe("DurationSelector", () => {
  it("increments by the 5-minute step", () => {
    const { onChange } = setup(25);
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it("decrements by the step and clamps at the 5-minute minimum", () => {
    const { onChange } = setup(5);
    fireEvent.click(screen.getByRole("button", { name: "-" }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("clamps a typed value above the maximum to 300 on commit", () => {
    const { onChange } = setup(25);
    const input = screen.getByTestId("duration-input");
    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.blur(input, { target: { value: "999" } });
    expect(onChange).toHaveBeenCalledWith(300);
  });

  it("clamps a typed value below the minimum to 5 on commit", () => {
    const { onChange } = setup(25);
    const input = screen.getByTestId("duration-input");
    fireEvent.change(input, { target: { value: "2" } });
    fireEvent.blur(input, { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("commits on Enter", () => {
    const { onChange } = setup(25);
    const input = screen.getByTestId("duration-input");
    fireEvent.change(input, { target: { value: "40" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(40);
  });
});

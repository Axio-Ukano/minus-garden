// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastContainer } from "./ToastContainer";
import { useToastStore, pushToast } from "./toastStore";

const TTL = 4000;
const FADE = 300;

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function push(message: string) {
  act(() => {
    pushToast(message);
  });
}

describe("toastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("stacks distinct messages as separate entries", () => {
    pushToast("first");
    pushToast("second");
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });

  it("re-pushing an identical message bumps seq instead of stacking", () => {
    const id1 = pushToast("same", "error");
    const id2 = pushToast("same", "error");
    const { toasts } = useToastStore.getState();
    expect(id2).toBe(id1);
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.seq).toBe(1);
  });

  it("same message with a different kind is a separate toast", () => {
    pushToast("same", "info");
    pushToast("same", "error");
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });

  it("dismiss removes only the matching toast", () => {
    const id = pushToast("first");
    pushToast("second");
    useToastStore.getState().dismiss(id);
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.message).toBe("second");
  });
});

describe("ToastContainer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("auto-dismisses a toast after TTL + fade", () => {
    render(<ToastContainer />);
    push("hello");
    expect(screen.getByText("hello")).toBeDefined();
    advance(TTL + 20); // countdown elapses, fade-out starts
    advance(FADE + 20); // fade finishes, toast removed
    expect(screen.queryByText("hello")).toBeNull();
  });

  it("each toast keeps its own countdown when a new one arrives", () => {
    render(<ToastContainer />);
    push("first");
    advance(2000);
    push("second");
    // "first" dies on its original schedule, unaffected by "second" arriving.
    advance(TTL - 2000 + 20);
    advance(FADE + 20);
    expect(screen.queryByText("first")).toBeNull();
    expect(screen.getByText("second")).toBeDefined();
    // "second" dies on its own schedule too.
    advance(2000);
    advance(FADE + 20);
    expect(screen.queryByText("second")).toBeNull();
  });

  it("dismissing one toast does not extend the lifetime of the rest", () => {
    render(<ToastContainer />);
    push("first");
    advance(1000);
    push("second");
    advance(TTL - 1000 + 20);
    advance(FADE + 20);
    expect(screen.queryByText("first")).toBeNull();
    // If "first" expiring had reset the countdown of "second", "second"
    // would now outlive its own TTL.
    advance(1000);
    advance(FADE + 20);
    expect(screen.queryByText("second")).toBeNull();
  });

  it("re-pushing an identical message restarts the countdown without stacking", () => {
    render(<ToastContainer />);
    push("same");
    advance(TTL - 100);
    push("same");
    expect(screen.getAllByTestId("toast")).toHaveLength(1);
    // Countdown restarted: still alive well past the original deadline.
    advance(TTL - 100);
    expect(screen.getByText("same")).toBeDefined();
    advance(100 + 20);
    advance(FADE + 20);
    expect(screen.queryByText("same")).toBeNull();
  });

  it("re-pushing during the fade-out revives the toast", () => {
    render(<ToastContainer />);
    push("same");
    advance(TTL + 20); // fade-out under way
    push("same"); // seq bump cancels the dismissal
    advance(FADE + 20);
    expect(screen.getByText("same")).toBeDefined();
  });

  it("the close button dismisses the toast before its time is up", () => {
    render(<ToastContainer />);
    push("closable");
    advance(50);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    // Fade-out starts immediately; removal happens after the transition.
    expect(screen.getByTestId("toast").className).not.toContain("visible");
    advance(FADE + 20);
    expect(screen.queryByText("closable")).toBeNull();
  });

  it("starts hidden and becomes visible so the entry transition plays", () => {
    render(<ToastContainer />);
    push("animated");
    expect(screen.getByTestId("toast").className).not.toContain("visible");
    advance(20);
    expect(screen.getByTestId("toast").className).toContain("visible");
  });
});

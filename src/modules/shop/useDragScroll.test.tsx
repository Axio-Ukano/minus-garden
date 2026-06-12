// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { useDragScroll } from "./useDragScroll";

// The jsdom test env has no PointerEvent or pointer-capture; polyfill the
// minimum the hook touches so a real drag can be driven here.
beforeAll(() => {
  if (typeof PointerEvent === "undefined") {
    class PointerEventPolyfill extends MouseEvent {
      pointerId: number;
      pointerType: string;
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 1;
        this.pointerType = params.pointerType ?? "mouse";
      }
    }
    (globalThis as unknown as { PointerEvent: typeof PointerEvent }).PointerEvent =
      PointerEventPolyfill as unknown as typeof PointerEvent;
  }
  for (const method of ["setPointerCapture", "releasePointerCapture", "hasPointerCapture"]) {
    if (!(method in Element.prototype)) {
      (Element.prototype as unknown as Record<string, () => void>)[method] = () => {};
    }
  }
});

function Harness({ onChildClick }: { onChildClick?: () => void }) {
  const { ref, dragging, scrollable, dragHandlers } = useDragScroll<HTMLDivElement>();
  return (
    <div
      data-testid="strip"
      ref={ref}
      className={["strip", dragging && "is-dragging", scrollable && "is-scrollable"]
        .filter(Boolean)
        .join(" ")}
      {...dragHandlers}
    >
      <button type="button" data-testid="child" onClick={onChildClick}>
        x
      </button>
    </div>
  );
}

// jsdom's scrollLeft does not react to layout, so back it with a real value and
// mock the overflow geometry the hook reads.
function makeScrollable(el: HTMLElement, scrollWidth: number, clientWidth: number) {
  let scrollLeft = 0;
  Object.defineProperty(el, "scrollWidth", { configurable: true, value: scrollWidth });
  Object.defineProperty(el, "clientWidth", { configurable: true, value: clientWidth });
  Object.defineProperty(el, "scrollLeft", {
    configurable: true,
    get: () => scrollLeft,
    set: (v: number) => {
      scrollLeft = v;
    },
  });
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

describe("useDragScroll", () => {
  it("flags the element scrollable only when it overflows horizontally", () => {
    const { getByTestId } = render(<Harness />);
    const el = getByTestId("strip");
    expect(el.className).not.toContain("is-scrollable");

    makeScrollable(el, 500, 200);
    expect(el.className).toContain("is-scrollable");
  });

  it("drags the scroll position and toggles the dragging state", () => {
    const { getByTestId } = render(<Harness />);
    const el = getByTestId("strip");
    makeScrollable(el, 500, 200);

    fireEvent.pointerDown(el, { button: 0, clientX: 100, pointerId: 1, pointerType: "mouse" });
    expect(el.className).toContain("is-dragging");

    // Pulling the pointer left by 30px scrolls the content 30px to the right.
    fireEvent.pointerMove(el, { clientX: 70, pointerId: 1 });
    expect(el.scrollLeft).toBe(30);

    fireEvent.pointerUp(el, { pointerId: 1 });
    expect(el.className).not.toContain("is-dragging");
  });

  it("does nothing when there is no overflow to drag through", () => {
    const { getByTestId } = render(<Harness />);
    const el = getByTestId("strip");
    fireEvent.pointerDown(el, { button: 0, clientX: 100, pointerId: 1, pointerType: "mouse" });
    expect(el.className).not.toContain("is-dragging");
  });

  it("ignores non-primary buttons and touch pointers", () => {
    const { getByTestId } = render(<Harness />);
    const el = getByTestId("strip");
    makeScrollable(el, 500, 200);

    fireEvent.pointerDown(el, { button: 1, clientX: 100, pointerId: 1, pointerType: "mouse" });
    expect(el.className).not.toContain("is-dragging");

    fireEvent.pointerDown(el, { button: 0, clientX: 100, pointerId: 2, pointerType: "touch" });
    expect(el.className).not.toContain("is-dragging");
  });

  it("lets a plain click through but swallows the click that ends a real drag", () => {
    const onChildClick = vi.fn();
    const { getByTestId } = render(<Harness onChildClick={onChildClick} />);
    const el = getByTestId("strip");
    const child = getByTestId("child");
    makeScrollable(el, 500, 200);

    // A click with no drag reaches the child.
    fireEvent.click(child);
    expect(onChildClick).toHaveBeenCalledTimes(1);

    // A click that terminates a real drag is suppressed.
    fireEvent.pointerDown(el, { button: 0, clientX: 100, pointerId: 1, pointerType: "mouse" });
    fireEvent.pointerMove(el, { clientX: 60, pointerId: 1 });
    fireEvent.pointerUp(el, { pointerId: 1 });
    fireEvent.click(child);
    expect(onChildClick).toHaveBeenCalledTimes(1);
  });
});

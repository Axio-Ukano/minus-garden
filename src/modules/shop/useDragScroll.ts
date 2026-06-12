// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── useDragScroll ────────────────────────────────────────────────────────────
// Click-and-drag horizontal scrolling for an overflowing strip, on top of the
// native scrollbar/wheel (never a replacement). Pointer-based so it coexists
// with touch (native touch scroll is left untouched). Reports `scrollable` so
// callers can show the grab cursor only when there is somewhere to drag.

import { useCallback, useEffect, useRef, useState } from "react";

// A press that moves less than this is treated as a click, not a drag, so any
// interactive child inside the strip keeps working.
const DRAG_THRESHOLD_PX = 4;

interface DragState {
  startX: number;
  startScroll: number;
  pointerId: number;
  moved: boolean;
  active: boolean;
}

export interface DragScrollHandlers {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLElement>) => void;
  onClickCapture: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface DragScroll<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  /** True while a drag is in progress (drives the grabbing cursor). */
  dragging: boolean;
  /** True when the element overflows horizontally (drives the grab cursor). */
  scrollable: boolean;
  dragHandlers: DragScrollHandlers;
}

export function useDragScroll<T extends HTMLElement = HTMLDivElement>(): DragScroll<T> {
  const ref = useRef<T | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const drag = useRef<DragState>({
    startX: 0,
    startScroll: 0,
    pointerId: -1,
    moved: false,
    active: false,
  });

  // Keep `scrollable` in sync with the content so the grab affordance only
  // appears when there is genuine overflow to drag through.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScrollable(el.scrollWidth - el.clientWidth > 1);
    measure();
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(el);
    }
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    // Primary button only; leave touch to the platform's native momentum scroll.
    if (e.button !== 0 || e.pointerType === "touch") return;
    if (el.scrollWidth - el.clientWidth <= 1) return;
    drag.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      pointerId: e.pointerId,
      moved: false,
      active: true,
    };
    setDragging(true);
    // Capture keeps move/up flowing to the element even if the pointer leaves
    // it mid-drag. A nicety — the drag still works where it's unsupported.
    try {
      el.setPointerCapture?.(e.pointerId);
    } catch {
      /* unsupported (e.g. jsdom) — ignore */
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD_PX) drag.current.moved = true;
    // Browser clamps to the valid scroll range; dragging right reveals earlier
    // stages, dragging left reveals later ones (matches grabbing the content).
    el.scrollLeft = drag.current.startScroll - dx;
  }, []);

  const stop = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    try {
      ref.current?.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
    setDragging(false);
  }, []);

  // Swallow the click that terminates a real drag so a future interactive child
  // inside the strip doesn't fire on release. A plain click (no move) passes.
  const onClickCapture = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }, []);

  return {
    ref,
    dragging,
    scrollable,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: stop,
      onPointerCancel: stop,
      onClickCapture,
    },
  };
}

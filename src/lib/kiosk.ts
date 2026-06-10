// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Kiosk mode ──────────────────────────────────────────────────────────────
//
// Minu's Garden ships as a game inside a Tauri webview. This module strips the
// browser-app affordances that would otherwise leak through (right-click
// context menu, devtools shortcuts, image dragging) so it doesn't feel like a
// web page. Text selection is suppressed via CSS (see global.css) and re-enabled
// only for real text inputs.
//
// Note: production Tauri bundles already ship without devtools; the keyboard
// guards here are belt-and-suspenders, mostly meaningful during `tauri dev`.

/** True if the keyboard event is a devtools / view-source shortcut to swallow. */
export function isBlockedKey(e: KeyboardEvent): boolean {
  if (e.key === "F12") return true;

  const key = e.key.toLowerCase();
  // Ctrl/Cmd+Shift+I/J/C → devtools (inspect / console / element picker).
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === "i" || key === "j" || key === "c")) {
    return true;
  }
  // Ctrl/Cmd+U → view source.
  if ((e.ctrlKey || e.metaKey) && key === "u") {
    return true;
  }
  return false;
}

/**
 * Installs the kiosk guards on the given document. Returns a teardown function
 * that removes every listener (used by tests; the app installs once for life).
 */
export function initKiosk(target: Document = document): () => void {
  const onContextMenu = (e: MouseEvent): void => e.preventDefault();
  const onDragStart = (e: DragEvent): void => e.preventDefault();
  const onKeyDown = (e: KeyboardEvent): void => {
    if (isBlockedKey(e)) e.preventDefault();
  };

  target.addEventListener("contextmenu", onContextMenu);
  target.addEventListener("dragstart", onDragStart);
  target.addEventListener("keydown", onKeyDown);

  return () => {
    target.removeEventListener("contextmenu", onContextMenu);
    target.removeEventListener("dragstart", onDragStart);
    target.removeEventListener("keydown", onKeyDown);
  };
}

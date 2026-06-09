import { describe, it, expect, vi } from "vitest";
import { isBlockedKey, initKiosk } from "./kiosk";

function key(init: Partial<KeyboardEventInit> & { key: string }): KeyboardEvent {
  return new KeyboardEvent("keydown", init);
}

describe("isBlockedKey", () => {
  it("blocks F12", () => {
    expect(isBlockedKey(key({ key: "F12" }))).toBe(true);
  });

  it("blocks devtools combos (Ctrl+Shift+I/J/C)", () => {
    expect(isBlockedKey(key({ key: "I", ctrlKey: true, shiftKey: true }))).toBe(true);
    expect(isBlockedKey(key({ key: "j", ctrlKey: true, shiftKey: true }))).toBe(true);
    expect(isBlockedKey(key({ key: "C", ctrlKey: true, shiftKey: true }))).toBe(true);
  });

  it("blocks view-source (Ctrl+U) and the Cmd variants", () => {
    expect(isBlockedKey(key({ key: "u", ctrlKey: true }))).toBe(true);
    expect(isBlockedKey(key({ key: "i", metaKey: true, shiftKey: true }))).toBe(true);
  });

  it("does not block ordinary typing", () => {
    expect(isBlockedKey(key({ key: "a" }))).toBe(false);
    expect(isBlockedKey(key({ key: "i", ctrlKey: true }))).toBe(false); // no shift
    expect(isBlockedKey(key({ key: "c", ctrlKey: true }))).toBe(false); // plain copy
  });
});

describe("initKiosk", () => {
  it("prevents the context menu and tears down cleanly", () => {
    const teardown = initKiosk(document);

    const evt = new MouseEvent("contextmenu", { cancelable: true, bubbles: true });
    document.dispatchEvent(evt);
    expect(evt.defaultPrevented).toBe(true);

    teardown();

    const after = new MouseEvent("contextmenu", { cancelable: true, bubbles: true });
    document.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(false);
  });

  it("prevents blocked key shortcuts while installed", () => {
    const teardown = initKiosk(document);
    const evt = key({ key: "F12", cancelable: true, bubbles: true });
    document.dispatchEvent(evt);
    expect(evt.defaultPrevented).toBe(true);
    teardown();
  });

  it("defaults its target to the global document", () => {
    const spy = vi.spyOn(document, "addEventListener");
    const teardown = initKiosk();
    expect(spy).toHaveBeenCalled();
    teardown();
    spy.mockRestore();
  });
});

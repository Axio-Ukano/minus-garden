// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, vi } from "vitest";

const { invokeMock, pushToastMock, getLanguageMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
  pushToastMock: vi.fn(),
  getLanguageMock: vi.fn<() => "en" | "es">(() => "en"),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: invokeMock,
}));

vi.mock("./toast", () => ({
  pushToast: pushToastMock,
}));

vi.mock("@/modules/settings", () => ({
  useSettingsStore: {
    getState: () => ({ language: getLanguageMock() }),
  },
}));

import { tauriInvoke, TauriError } from "./tauri";

describe("tauriInvoke", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    pushToastMock.mockReset();
    getLanguageMock.mockReturnValue("en");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("forwards command and args to invoke and returns its value", async () => {
    invokeMock.mockResolvedValueOnce({ ok: true });
    const result = await tauriInvoke<{ ok: boolean }>("get_sessions", { limit: 10 });
    expect(invokeMock).toHaveBeenCalledWith("get_sessions", { limit: 10 });
    expect(result).toEqual({ ok: true });
    expect(pushToastMock).not.toHaveBeenCalled();
  });

  it("works without args", async () => {
    invokeMock.mockResolvedValueOnce(42);
    const result = await tauriInvoke<number>("get_user_state");
    expect(invokeMock).toHaveBeenCalledWith("get_user_state", undefined);
    expect(result).toBe(42);
  });

  it("throws TauriError, surfaces a localized toast and logs on string error", async () => {
    invokeMock.mockRejectedValueOnce("DB locked");
    await expect(tauriInvoke("save_session", { session: {} })).rejects.toBeInstanceOf(TauriError);
    expect(pushToastMock).toHaveBeenCalledTimes(1);
    const [message, kind] = pushToastMock.mock.calls[0]!;
    expect(typeof message).toBe("string");
    expect(message.length).toBeGreaterThan(0);
    expect(kind).toBe("error");
    expect(console.error).toHaveBeenCalledWith("[tauriInvoke:save_session]", "DB locked");
  });

  it("preserves the raw error on TauriError.raw", async () => {
    invokeMock.mockRejectedValueOnce(new Error("boom"));
    try {
      await tauriInvoke("get_sessions");
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(TauriError);
      expect((e as TauriError).command).toBe("get_sessions");
      expect((e as TauriError).raw).toBe("boom");
    }
  });

  it("special-cases 'Subject name already exists' to subject_name_taken", async () => {
    invokeMock.mockRejectedValueOnce("Subject name already exists");
    await expect(tauriInvoke("save_subject", { name: "math" })).rejects.toBeInstanceOf(TauriError);
    const [message] = pushToastMock.mock.calls[0]!;
    expect(message).toMatch(/already (exists|taken)|exists/i);
  });

  it("uses Spanish messages when language is 'es'", async () => {
    getLanguageMock.mockReturnValue("es");
    invokeMock.mockRejectedValueOnce("any");
    await expect(tauriInvoke("get_sessions")).rejects.toBeInstanceOf(TauriError);
    const [messageEs] = pushToastMock.mock.calls[0]!;
    pushToastMock.mockClear();

    getLanguageMock.mockReturnValue("en");
    invokeMock.mockRejectedValueOnce("any");
    await expect(tauriInvoke("get_sessions")).rejects.toBeInstanceOf(TauriError);
    const [messageEn] = pushToastMock.mock.calls[0]!;

    expect(messageEs).not.toBe(messageEn);
  });
});

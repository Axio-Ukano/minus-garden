// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, vi } from "vitest";

const { tauriInvokeMock, FakeTauriError } = vi.hoisted(() => {
  class HoistedTauriError extends Error {
    raw: string;
    constructor(raw: string) {
      super(raw);
      this.name = "TauriError";
      this.raw = raw;
    }
  }
  return {
    tauriInvokeMock: vi.fn(),
    FakeTauriError: HoistedTauriError,
  };
});

vi.mock("@/lib/tauri", () => ({
  tauriInvoke: tauriInvokeMock,
  TauriError: FakeTauriError,
}));

import { useHistoryStore, type Session } from "./historyStore";

const sampleSession: Session = {
  id: "abc",
  start_time: "2026-04-27T10:00:00Z",
  end_time: "2026-04-27T10:25:00Z",
  duration_minutes: 25,
  subject: "math",
  completed: true,
  hearts_earned: 5,
  plant_species: "daisy",
  plant_stage: 5,
};

const initial = useHistoryStore.getState();

describe("historyStore", () => {
  beforeEach(() => {
    tauriInvokeMock.mockReset();
    useHistoryStore.setState({
      sessions: [],
      totalHearts: 0,
      loading: false,
      error: null,
      loadSessions: initial.loadSessions,
      loadUserState: initial.loadUserState,
      saveSession: initial.saveSession,
      deleteSession: initial.deleteSession,
      syncHearts: initial.syncHearts,
      addHearts: initial.addHearts,
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("loadSessions", () => {
    it("hydrates sessions on success", async () => {
      tauriInvokeMock.mockResolvedValueOnce([sampleSession]);
      await useHistoryStore.getState().loadSessions();
      const s = useHistoryStore.getState();
      expect(tauriInvokeMock).toHaveBeenCalledWith("get_sessions");
      expect(s.sessions).toEqual([sampleSession]);
      expect(s.loading).toBe(false);
      expect(s.error).toBeNull();
    });

    it("captures error and clears loading on failure", async () => {
      tauriInvokeMock.mockRejectedValueOnce(new FakeTauriError("DB locked"));
      await useHistoryStore.getState().loadSessions();
      const s = useHistoryStore.getState();
      expect(s.loading).toBe(false);
      expect(s.error).toBe("DB locked");
      expect(s.sessions).toEqual([]);
    });

    it("falls back to String(e) for non-TauriError failures", async () => {
      tauriInvokeMock.mockRejectedValueOnce("plain string");
      await useHistoryStore.getState().loadSessions();
      expect(useHistoryStore.getState().error).toBe("plain string");
    });
  });

  describe("loadUserState", () => {
    it("hydrates totalHearts on success", async () => {
      tauriInvokeMock.mockResolvedValueOnce({ total_hearts: 42 });
      await useHistoryStore.getState().loadUserState();
      expect(useHistoryStore.getState().totalHearts).toBe(42);
    });

    it("preserves last known totalHearts on failure (toast handled by tauriInvoke)", async () => {
      useHistoryStore.setState({ totalHearts: 7 });
      tauriInvokeMock.mockRejectedValueOnce(new FakeTauriError("nope"));
      await useHistoryStore.getState().loadUserState();
      expect(useHistoryStore.getState().totalHearts).toBe(7);
      expect(console.error).toHaveBeenCalledWith(
        "[historyStore.loadUserState]",
        expect.any(FakeTauriError)
      );
    });
  });

  describe("saveSession", () => {
    it("persists then reloads sessions", async () => {
      tauriInvokeMock
        .mockResolvedValueOnce(undefined) // save_session
        .mockResolvedValueOnce([sampleSession]); // get_sessions
      await useHistoryStore.getState().saveSession(sampleSession);
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(1, "save_session", {
        session: sampleSession,
      });
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(2, "get_sessions");
      expect(useHistoryStore.getState().sessions).toEqual([sampleSession]);
    });
  });

  describe("deleteSession", () => {
    it("calls delete_session and reloads", async () => {
      tauriInvokeMock
        .mockResolvedValueOnce(undefined) // delete_session
        .mockResolvedValueOnce([]); // get_sessions
      await useHistoryStore.getState().deleteSession("abc");
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(1, "delete_session", { id: "abc" });
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(2, "get_sessions");
      expect(useHistoryStore.getState().sessions).toEqual([]);
    });
  });

  describe("syncHearts", () => {
    it("updates backend then local state", async () => {
      tauriInvokeMock.mockResolvedValueOnce(undefined);
      await useHistoryStore.getState().syncHearts(15);
      expect(tauriInvokeMock).toHaveBeenCalledWith("update_hearts", { totalHearts: 15 });
      expect(useHistoryStore.getState().totalHearts).toBe(15);
    });
  });

  describe("addHearts", () => {
    it("re-reads the persisted total before writing", async () => {
      // In-memory total is stale (0); the backend holds 40.
      tauriInvokeMock
        .mockResolvedValueOnce({ total_hearts: 40 }) // get_user_state
        .mockResolvedValueOnce(undefined); // update_hearts
      await useHistoryStore.getState().addHearts(5);
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(1, "get_user_state");
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(2, "update_hearts", { totalHearts: 45 });
      expect(useHistoryStore.getState().totalHearts).toBe(45);
    });

    it("falls back to the in-memory total when the read fails", async () => {
      useHistoryStore.setState({ totalHearts: 7 });
      tauriInvokeMock
        .mockRejectedValueOnce(new FakeTauriError("nope")) // get_user_state
        .mockResolvedValueOnce(undefined); // update_hearts
      await useHistoryStore.getState().addHearts(3);
      expect(tauriInvokeMock).toHaveBeenNthCalledWith(2, "update_hearts", { totalHearts: 10 });
      expect(useHistoryStore.getState().totalHearts).toBe(10);
    });
  });
});

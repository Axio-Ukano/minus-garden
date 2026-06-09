import { describe, it, expect, beforeEach, vi } from "vitest";

const { tauriInvokeMock } = vi.hoisted(() => ({ tauriInvokeMock: vi.fn() }));

vi.mock("@/lib/tauri", () => ({ tauriInvoke: tauriInvokeMock }));

import { repository } from "./index";

describe("repository", () => {
  beforeEach(() => {
    tauriInvokeMock.mockReset();
  });

  describe("sessions", () => {
    it("list forwards to get_sessions", async () => {
      tauriInvokeMock.mockResolvedValueOnce([]);
      await repository.sessions.list();
      expect(tauriInvokeMock).toHaveBeenCalledWith("get_sessions");
    });

    it("save wraps the session in a payload object", async () => {
      tauriInvokeMock.mockResolvedValueOnce(undefined);
      const session = { id: "x" } as never;
      await repository.sessions.save(session);
      expect(tauriInvokeMock).toHaveBeenCalledWith("save_session", { session });
    });

    it("remove forwards the id", async () => {
      tauriInvokeMock.mockResolvedValueOnce(undefined);
      await repository.sessions.remove("abc");
      expect(tauriInvokeMock).toHaveBeenCalledWith("delete_session", { id: "abc" });
    });
  });

  describe("userState", () => {
    it("maps total_hearts (wire) to totalHearts (domain)", async () => {
      tauriInvokeMock.mockResolvedValueOnce({ total_hearts: 42 });
      const state = await repository.userState.get();
      expect(state).toEqual({ totalHearts: 42 });
      expect(tauriInvokeMock).toHaveBeenCalledWith("get_user_state");
    });

    it("setHearts forwards totalHearts", async () => {
      tauriInvokeMock.mockResolvedValueOnce(undefined);
      await repository.userState.setHearts(7);
      expect(tauriInvokeMock).toHaveBeenCalledWith("update_hearts", { totalHearts: 7 });
    });
  });

  describe("subjects", () => {
    it("maps use_count (wire) to useCount (domain)", async () => {
      tauriInvokeMock.mockResolvedValueOnce([
        { id: "1", name: "Math", color: "#fff", use_count: 3 },
      ]);
      const subjects = await repository.subjects.list();
      expect(subjects).toEqual([{ id: "1", name: "Math", color: "#fff", useCount: 3 }]);
      expect(tauriInvokeMock).toHaveBeenCalledWith("get_subjects");
    });

    it("create forwards name and color", async () => {
      tauriInvokeMock.mockResolvedValueOnce(undefined);
      await repository.subjects.create("Math", "#fff");
      expect(tauriInvokeMock).toHaveBeenCalledWith("save_subject", {
        name: "Math",
        color: "#fff",
      });
    });

    it("markUsed forwards the id", async () => {
      tauriInvokeMock.mockResolvedValueOnce(undefined);
      await repository.subjects.markUsed("1");
      expect(tauriInvokeMock).toHaveBeenCalledWith("update_subject_usage", { id: "1" });
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";

// vi.mock is hoisted; mocks must be declared inside vi.hoisted to be visible
// from the factory. This pattern is the documented Vitest workaround.
const { saveSessionMock, syncHeartsMock, playSfxMock } = vi.hoisted(() => ({
  saveSessionMock: vi.fn(),
  syncHeartsMock: vi.fn(),
  playSfxMock: vi.fn(),
}));

vi.mock("@/modules/history", () => ({
  useHistoryStore: {
    getState: () => ({
      saveSession: saveSessionMock,
      syncHearts: syncHeartsMock,
      totalHearts: 0,
    }),
  },
}));

vi.mock("@/modules/audio", () => ({
  audioService: {
    playSfx: playSfxMock,
  },
}));

vi.mock("@/modules/settings", () => ({
  useSettingsStore: {
    getState: () => ({ masterVolume: 0.5, sfxVolume: 0.5 }),
  },
}));

import { useTimerStore } from "./timerStore";

const initialSnapshot = useTimerStore.getState();

describe("timerStore", () => {
  beforeEach(() => {
    saveSessionMock.mockClear();
    syncHeartsMock.mockClear();
    playSfxMock.mockClear();
    useTimerStore.setState({
      durationMinutes: 25,
      secondsLeft: 25 * 60,
      status: "idle",
      subject: "",
      startedAt: null,
      plantSpeciesId: "daisy",
      start: initialSnapshot.start,
      pause: initialSnapshot.pause,
      resume: initialSnapshot.resume,
      reset: initialSnapshot.reset,
      finish: initialSnapshot.finish,
      tick: initialSnapshot.tick,
      setDuration: initialSnapshot.setDuration,
      setSubject: initialSnapshot.setSubject,
      setPlantSpecies: initialSnapshot.setPlantSpecies,
    });
  });

  describe("transitions", () => {
    it("starts from idle to running and seeds secondsLeft from durationMinutes", () => {
      useTimerStore.getState().setDuration(10);
      useTimerStore.getState().start();
      const s = useTimerStore.getState();
      expect(s.status).toBe("running");
      expect(s.secondsLeft).toBe(600);
      expect(s.startedAt).not.toBeNull();
      expect(playSfxMock).toHaveBeenCalledWith("timer_start", 0.5, 0.5);
    });

    it("pauses a running timer", () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();
      expect(useTimerStore.getState().status).toBe("paused");
      expect(playSfxMock).toHaveBeenCalledWith("timer_pause", 0.5, 0.5);
    });

    it("resumes from paused to running", () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();
      useTimerStore.getState().resume();
      expect(useTimerStore.getState().status).toBe("running");
    });

    it("resets to idle and restores secondsLeft from durationMinutes", () => {
      useTimerStore.getState().setDuration(15);
      useTimerStore.getState().start();
      useTimerStore.setState({ secondsLeft: 100 });
      useTimerStore.getState().reset();
      const s = useTimerStore.getState();
      expect(s.status).toBe("idle");
      expect(s.secondsLeft).toBe(15 * 60);
      expect(s.startedAt).toBeNull();
    });
  });

  describe("tick", () => {
    it("decrements secondsLeft when above 1", () => {
      useTimerStore.setState({ secondsLeft: 10, status: "running" });
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().secondsLeft).toBe(9);
    });

    it("calls finish when secondsLeft reaches 1", () => {
      useTimerStore.setState({
        secondsLeft: 1,
        status: "running",
        durationMinutes: 25,
        subject: "math",
        startedAt: new Date().toISOString(),
        plantSpeciesId: "daisy",
      });
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().status).toBe("finished");
      expect(useTimerStore.getState().secondsLeft).toBe(0);
    });
  });

  describe("finish — hearts calculation", () => {
    it.each([
      [25, 5],
      [50, 10],
      [4, 0],
      [5, 1],
      [60, 12],
    ])(
      "duration=%i minutes => hearts=%i (Math.floor(duration/5))",
      (durationMinutes, expectedHearts) => {
        useTimerStore.setState({
          durationMinutes,
          subject: "math",
          startedAt: new Date().toISOString(),
          plantSpeciesId: "daisy",
        });
        useTimerStore.getState().finish();
        expect(saveSessionMock).toHaveBeenCalledTimes(1);
        const session = saveSessionMock.mock.calls[0]?.[0];
        expect(session.hearts_earned).toBe(expectedHearts);
        expect(session.duration_minutes).toBe(durationMinutes);
        expect(session.subject).toBe("math");
        expect(session.completed).toBe(true);
        expect(session.id).toBeTypeOf("string");
      }
    );

    it("syncs hearts by adding earned hearts to current total", () => {
      useTimerStore.setState({ durationMinutes: 25 });
      useTimerStore.getState().finish();
      expect(syncHeartsMock).toHaveBeenCalledWith(5);
    });

    it("plays timer_finish sfx and schedules session_saved sfx", () => {
      vi.useFakeTimers();
      useTimerStore.setState({ durationMinutes: 25 });
      useTimerStore.getState().finish();
      expect(playSfxMock).toHaveBeenCalledWith("timer_finish", 0.5, 0.5);
      expect(playSfxMock).not.toHaveBeenCalledWith("session_saved", 0.5, 0.5);
      vi.advanceTimersByTime(800);
      expect(playSfxMock).toHaveBeenCalledWith("session_saved", 0.5, 0.5);
      vi.useRealTimers();
    });

    it("uses current ISO time as start_time when startedAt is null", () => {
      useTimerStore.setState({ durationMinutes: 25, startedAt: null });
      useTimerStore.getState().finish();
      const session = saveSessionMock.mock.calls[0]?.[0];
      expect(session.start_time).toBeTypeOf("string");
      expect(session.end_time).toBeTypeOf("string");
    });
  });

  describe("setters", () => {
    it("setDuration resets status to idle", () => {
      useTimerStore.setState({ status: "paused" });
      useTimerStore.getState().setDuration(45);
      const s = useTimerStore.getState();
      expect(s.durationMinutes).toBe(45);
      expect(s.secondsLeft).toBe(45 * 60);
      expect(s.status).toBe("idle");
    });

    it("setSubject updates subject only", () => {
      useTimerStore.getState().setSubject("biology");
      expect(useTimerStore.getState().subject).toBe("biology");
    });

    it("setPlantSpecies updates plantSpeciesId only", () => {
      useTimerStore.getState().setPlantSpecies("orchid");
      expect(useTimerStore.getState().plantSpeciesId).toBe("orchid");
    });
  });
});

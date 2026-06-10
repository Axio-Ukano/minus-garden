// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { describe, it, expect, beforeEach, vi } from "vitest";

const { howlInstances, HowlMock } = vi.hoisted(() => {
  type Cb = () => void;
  // FakeHowl declares vi.fn-typed methods so .mock is accessible in tests.
  interface FakeHowl {
    src: string[];
    loop: boolean;
    volumeValue: number;
    playing_: boolean;
    seekValue: number;
    durationValue: number;
    onend?: Cb;
    onload?: Cb;
    play: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    unload: ReturnType<typeof vi.fn>;
    volume: ReturnType<typeof vi.fn>;
    seek: ReturnType<typeof vi.fn>;
    duration: ReturnType<typeof vi.fn>;
    playing: ReturnType<typeof vi.fn>;
    triggerEnd: () => void;
    triggerLoad: () => void;
  }
  const instances: FakeHowl[] = [];
  function HowlMockImpl(this: unknown, opts: Record<string, unknown>) {
    const inst: FakeHowl = {
      src: (opts.src as string[]) ?? [],
      loop: (opts.loop as boolean) ?? false,
      volumeValue: (opts.volume as number) ?? 1,
      playing_: false,
      seekValue: 0,
      durationValue: 100,
      onend: opts.onend as Cb | undefined,
      onload: opts.onload as Cb | undefined,
      play: vi.fn(() => {
        inst.playing_ = true;
      }),
      stop: vi.fn(() => {
        inst.playing_ = false;
        inst.seekValue = 0;
      }),
      pause: vi.fn(() => {
        inst.playing_ = false;
      }),
      unload: vi.fn(),
      volume: vi.fn((v?: number) => {
        if (v !== undefined) inst.volumeValue = v;
        return inst.volumeValue;
      }),
      seek: vi.fn((s?: number) => {
        if (s !== undefined) inst.seekValue = s;
        return inst.seekValue;
      }),
      duration: vi.fn(() => inst.durationValue),
      playing: vi.fn(() => inst.playing_),
      triggerEnd: () => inst.onend?.(),
      triggerLoad: () => inst.onload?.(),
    };
    instances.push(inst);
    return inst;
  }
  return {
    howlInstances: instances,
    HowlMock: HowlMockImpl as unknown as new (opts: unknown) => unknown,
  };
});

vi.mock("howler", () => ({
  Howl: HowlMock,
}));

// Import AFTER the mock; module-load constructs all SFX Howls.
import { audioService } from "./audioService";

function lastInstance() {
  return howlInstances[howlInstances.length - 1]!;
}

describe("audioService", () => {
  beforeEach(() => {
    // Stop and reset any active ambient/music between tests.
    audioService.stopAmbient();
    audioService.stopMusic();
  });

  describe("playSfx", () => {
    it("sets volume to master*sfx and plays the sfx Howl", () => {
      audioService.playSfx("button_click", 0.5, 0.4);
      // SFX howls were created at module load; find the one that was played.
      const sfxClickInstance = howlInstances.find((h) => h.src[0]?.includes("button_click.mp3"));
      expect(sfxClickInstance).toBeDefined();
      expect(sfxClickInstance!.volume).toHaveBeenCalledWith(0.2);
      expect(sfxClickInstance!.play).toHaveBeenCalled();
    });

    it("does nothing when effective volume is 0", () => {
      const sfxClickInstance = howlInstances.find((h) => h.src[0]?.includes("button_click.mp3"))!;
      const playCallsBefore = sfxClickInstance.play.mock.calls.length;
      audioService.playSfx("button_click", 0, 0.5);
      expect(sfxClickInstance.play.mock.calls.length).toBe(playCallsBefore);
    });
  });

  describe("ambient", () => {
    it("setAmbient creates a looping Howl and plays it", () => {
      audioService.setAmbient("rain", 1, 0.5);
      const inst = lastInstance();
      expect(inst.src[0]).toContain("rain.mp3");
      expect(inst.loop).toBe(true);
      expect(inst.volumeValue).toBe(0.5);
      expect(inst.play).toHaveBeenCalled();
    });

    it("setAmbient(null) stops and unloads the existing ambient", () => {
      audioService.setAmbient("rain", 1, 0.5);
      const rainInst = lastInstance();
      audioService.setAmbient(null);
      expect(rainInst.stop).toHaveBeenCalled();
      expect(rainInst.unload).toHaveBeenCalled();
    });

    it("setAmbientVolume updates the active ambient's volume", () => {
      audioService.setAmbient("forest", 0.8, 0.5);
      const forestInst = lastInstance();
      audioService.setAmbientVolume(0.5, 0.5);
      expect(forestInst.volume).toHaveBeenLastCalledWith(0.25);
    });

    it("stopAmbient clears the active ambient", () => {
      audioService.setAmbient("cafe", 1, 0.5);
      const cafeInst = lastInstance();
      audioService.stopAmbient();
      expect(cafeInst.stop).toHaveBeenCalled();
      expect(cafeInst.unload).toHaveBeenCalled();
    });
  });

  describe("music", () => {
    it("playMusic creates a Howl with computed volume and triggers play", () => {
      audioService.playMusic("/songs/track-1.mp3", 1, 0.7);
      const inst = lastInstance();
      expect(inst.src[0]).toBe("/songs/track-1.mp3");
      expect(inst.volumeValue).toBe(0.7);
      expect(inst.play).toHaveBeenCalled();
    });

    it("pauseMusic and resumeMusic delegate to the active Howl", () => {
      audioService.playMusic("/songs/track-1.mp3", 1, 0.7);
      const inst = lastInstance();
      audioService.pauseMusic();
      expect(inst.pause).toHaveBeenCalled();
      audioService.resumeMusic();
      expect(inst.play).toHaveBeenCalledTimes(2);
    });

    it("seekMusic forwards the position to the Howl", () => {
      audioService.playMusic("/songs/track-1.mp3", 1, 0.7);
      const inst = lastInstance();
      audioService.seekMusic(42);
      expect(inst.seek).toHaveBeenLastCalledWith(42);
    });

    it("setMusicVolume updates the active music volume", () => {
      audioService.playMusic("/songs/track-1.mp3", 1, 0.7);
      const inst = lastInstance();
      audioService.setMusicVolume(0.5, 0.6);
      expect(inst.volume).toHaveBeenLastCalledWith(0.3);
    });

    it("invokes onMusicEnded callback when the Howl ends", () => {
      audioService.playMusic("/songs/track-1.mp3", 1, 0.7);
      const inst = lastInstance();
      const cb = vi.fn();
      audioService.onMusicEnded(cb);
      inst.triggerEnd();
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it("getMusicDuration / getMusicCurrentTime / isMusicPlaying read from the Howl", () => {
      audioService.playMusic("/songs/track-1.mp3", 1, 0.7);
      const inst = lastInstance();
      inst.durationValue = 180;
      inst.seekValue = 33;
      inst.playing_ = true;
      expect(audioService.getMusicDuration()).toBe(180);
      expect(audioService.getMusicCurrentTime()).toBe(33);
      expect(audioService.isMusicPlaying()).toBe(true);
    });

    it("returns 0 / false when no music is playing", () => {
      audioService.stopMusic();
      expect(audioService.getMusicDuration()).toBe(0);
      expect(audioService.getMusicCurrentTime()).toBe(0);
      expect(audioService.isMusicPlaying()).toBe(false);
    });
  });
});

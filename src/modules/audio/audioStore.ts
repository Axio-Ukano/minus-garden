import { create } from "zustand";
import { audioService } from "./audioService";
import type { AmbientTrackId } from "./audioService";
import { PLAYLIST } from "./audioRegistry";
import { useSettingsStore } from "../settings/settingsStore";

export type RepeatMode = "none" | "one" | "all";

interface AudioState {
  // Ambient
  activeAmbient: AmbientTrackId | null;
  isAmbientPlaying: boolean;
  _ambientRandomizerInterval: ReturnType<typeof setInterval> | null;

  // Music player
  currentTrackIndex: number | null;
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  progressSeconds: number;
  isMiniPlayerDismissed: boolean;

  // Actions — ambient
  setAmbient: (id: AmbientTrackId | null) => void;

  // Actions — music
  playTrack: (index: number) => void;
  togglePlayPause: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  seekTo: (seconds: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setProgressSeconds: (s: number) => void;
  dismissMiniPlayer: () => void;
  syncAmbientRandomizer: (settings: {
    ambientRandomize: boolean;
    ambientRandomizeMinutes: number;
    ambientRandomizePool: AmbientTrackId[];
  }) => void;
}

function getSettings() {
  const s = useSettingsStore.getState();
  return {
    master: s.masterMuted ? 0 : s.masterVolume,
    sfx: s.sfxMuted ? 0 : s.sfxVolume,
    ambient: s.ambientMuted ? 0 : s.ambientVolume,
    music: s.musicMuted ? 0 : s.musicVolume,
  };
}

function resolveNextIndex(
  current: number,
  total: number,
  shuffle: boolean,
  repeat: RepeatMode
): number | null {
  if (repeat === "one") return current;
  if (shuffle) {
    let next = Math.floor(Math.random() * total);
    if (total > 1 && next === current) next = (next + 1) % total;
    return next;
  }
  const next = current + 1;
  if (next >= total) return repeat === "all" ? 0 : null;
  return next;
}

export const useAudioStore = create<AudioState>((set, get) => {
  // Wire music end callback once
  audioService.onMusicEnded(() => {
    const { currentTrackIndex, isShuffle, repeatMode } = get();
    if (currentTrackIndex === null) return;
    const next = resolveNextIndex(currentTrackIndex, PLAYLIST.length, isShuffle, repeatMode);
    if (next !== null) {
      get().playTrack(next);
    } else {
      set({ isPlaying: false, progressSeconds: 0 });
    }
  });

  audioService.onMusicTimeUpdate((t) => {
    set({ progressSeconds: t });
  });

  return {
    activeAmbient: null,
    isAmbientPlaying: false,
    _ambientRandomizerInterval: null,
    currentTrackIndex: null,
    isPlaying: false,
    isShuffle: false,
    repeatMode: "none",
    progressSeconds: 0,
    isMiniPlayerDismissed: false,

    setAmbient: (id) => {
      const { master, ambient } = getSettings();
      if (id === null) {
        audioService.stopAmbient();
        set({ activeAmbient: null, isAmbientPlaying: false });
      } else {
        audioService.setAmbient(id, master, ambient);
        set({ activeAmbient: id, isAmbientPlaying: true });
      }
    },

    playTrack: (index) => {
      const { master, music } = getSettings();
      const track = PLAYLIST[index];
      if (!track) return;
      audioService.playMusic(track.src, master, music);
      set({
        currentTrackIndex: index,
        isPlaying: true,
        progressSeconds: 0,
        isMiniPlayerDismissed: false,
      });
    },

    togglePlayPause: () => {
      const { isPlaying, currentTrackIndex } = get();
      if (currentTrackIndex === null) {
        get().playTrack(0);
        return;
      }
      if (isPlaying) {
        audioService.pauseMusic();
        set({ isPlaying: false });
      } else {
        audioService.resumeMusic();
        set({ isPlaying: true });
      }
    },

    skipNext: () => {
      const { currentTrackIndex, isShuffle, repeatMode } = get();
      if (currentTrackIndex === null) {
        get().playTrack(0);
        return;
      }
      const next = resolveNextIndex(currentTrackIndex, PLAYLIST.length, isShuffle, repeatMode);
      if (next !== null) get().playTrack(next);
    },

    skipPrev: () => {
      const { currentTrackIndex, progressSeconds } = get();
      if (currentTrackIndex === null) return;
      // If > 3s into track, restart; otherwise go to previous
      if (progressSeconds > 3) {
        audioService.seekMusic(0);
        set({ progressSeconds: 0 });
      } else {
        const prev = currentTrackIndex === 0 ? PLAYLIST.length - 1 : currentTrackIndex - 1;
        get().playTrack(prev);
      }
    },

    seekTo: (seconds) => {
      audioService.seekMusic(seconds);
      set({ progressSeconds: seconds });
    },

    toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),

    cycleRepeat: () =>
      set((s) => ({
        repeatMode: s.repeatMode === "none" ? "all" : s.repeatMode === "all" ? "one" : "none",
      })),

    setProgressSeconds: (progressSeconds) => set({ progressSeconds }),

    dismissMiniPlayer: () => {
      set({ isMiniPlayerDismissed: true });
    },

    syncAmbientRandomizer: ({
      ambientRandomize,
      ambientRandomizeMinutes,
      ambientRandomizePool,
    }) => {
      const { _ambientRandomizerInterval } = get();
      if (_ambientRandomizerInterval !== null) {
        clearInterval(_ambientRandomizerInterval);
        set({ _ambientRandomizerInterval: null });
      }
      if (!ambientRandomize || ambientRandomizePool.length === 0) return;
      const interval = setInterval(
        () => {
          const { activeAmbient } = get();
          const pool = ambientRandomizePool.filter((id) => id !== activeAmbient);
          const candidates = pool.length > 0 ? pool : ambientRandomizePool;
          const newId = candidates[Math.floor(Math.random() * candidates.length)];
          get().setAmbient(newId);
        },
        ambientRandomizeMinutes * 60 * 1000
      );
      set({ _ambientRandomizerInterval: interval });
    },
  };
});

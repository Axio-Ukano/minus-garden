import { Howl } from "howler";

// ─── SFX ─────────────────────────────────────────────────────────────────────

export type SfxId =
  | "button_click"
  | "button_click_soft"
  | "button_click_hard"
  | "button_click_pop"
  | "type_soft"
  | "type_tick"
  | "type_mechanical"
  | "plant_grow"
  | "timer_start"
  | "timer_pause"
  | "timer_finish"
  | "session_saved";

export type ClickSfxId =
  | "button_click"
  | "button_click_soft"
  | "button_click_hard"
  | "button_click_pop"
  | "none";
export type TypingSfxId = "none" | "type_soft" | "type_tick" | "type_mechanical";

const SFX_SRCS: Record<SfxId, string> = {
  button_click: "/sounds/sfx/button_click.mp3",
  button_click_soft: "/sounds/sfx/button_click_soft.mp3",
  button_click_hard: "/sounds/sfx/button_click_hard.mp3",
  button_click_pop: "/sounds/sfx/button_click_pop.mp3",
  type_soft: "/sounds/sfx/type_soft.mp3",
  type_tick: "/sounds/sfx/type_tick.mp3",
  type_mechanical: "/sounds/sfx/type_mechanical.mp3",
  plant_grow: "/sounds/sfx/plant_grow.mp3",
  timer_start: "/sounds/sfx/timer_start.mp3",
  timer_pause: "/sounds/sfx/timer_pause.mp3",
  timer_finish: "/sounds/sfx/timer_finish.mp3",
  session_saved: "/sounds/sfx/session_saved.mp3",
};

const sfxHowls: Record<SfxId, Howl> = {} as Record<SfxId, Howl>;
for (const [id, src] of Object.entries(SFX_SRCS) as [SfxId, string][]) {
  sfxHowls[id] = new Howl({ src: [src], preload: true, volume: 1 });
}

// ─── Ambient ─────────────────────────────────────────────────────────────────

export type AmbientTrackId = "rain" | "forest" | "cafe" | "fireplace" | "white_noise";

const AMBIENT_SRCS: Record<AmbientTrackId, string> = {
  rain: "/sounds/ambient/rain.mp3",
  forest: "/sounds/ambient/forest.mp3",
  cafe: "/sounds/ambient/cafe.mp3",
  fireplace: "/sounds/ambient/fireplace.mp3",
  white_noise: "/sounds/ambient/white_noise.mp3",
};

let ambientHowl: Howl | null = null;
let ambientVolume = 0.5;

// ─── Music ───────────────────────────────────────────────────────────────────

let musicHowl: Howl | null = null;
let musicVolume = 0.7;
// Single-subscriber callbacks — only audioStore registers these.
let musicEndedCb: (() => void) | null = null;
let musicTimeUpdateCb: ((t: number) => void) | null = null;
let timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

function clearMusicHowl() {
  if (timeUpdateInterval !== null) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }
  if (musicHowl) {
    musicHowl.unload();
    musicHowl = null;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

function effectiveSfxVolume(master: number, sfx: number) {
  return master * sfx;
}

export const audioService = {
  // SFX
  playSfx(id: SfxId, master = 1, sfx = 1) {
    const vol = effectiveSfxVolume(master, sfx);
    if (vol === 0) return;
    const howl = sfxHowls[id];
    howl.volume(vol);
    // Allow rapid overlapping plays by stopping previous instance
    howl.stop();
    howl.play();
  },

  // Ambient
  setAmbient(id: AmbientTrackId | null, master = 1, ambient = 0.5) {
    if (ambientHowl) {
      ambientHowl.stop();
      ambientHowl.unload();
      ambientHowl = null;
    }
    if (!id) return;
    ambientVolume = master * ambient;
    ambientHowl = new Howl({
      src: [AMBIENT_SRCS[id]],
      loop: true,
      volume: ambientVolume,
    });
    ambientHowl.play();
  },

  setAmbientVolume(master: number, ambient: number) {
    ambientVolume = master * ambient;
    if (ambientHowl) ambientHowl.volume(ambientVolume);
  },

  stopAmbient() {
    if (ambientHowl) {
      ambientHowl.stop();
      ambientHowl.unload();
      ambientHowl = null;
    }
  },

  // Music
  playMusic(src: string, master = 1, music = 0.7) {
    clearMusicHowl();
    musicVolume = master * music;
    musicHowl = new Howl({
      src: [src],
      volume: musicVolume,
      onend: () => {
        if (musicEndedCb) musicEndedCb();
      },
      onload: () => {
        timeUpdateInterval = setInterval(() => {
          if (musicHowl && musicHowl.playing()) {
            const t = musicHowl.seek() as number;
            if (musicTimeUpdateCb) musicTimeUpdateCb(t);
          }
        }, 250);
      },
    });
    musicHowl.play();
  },

  pauseMusic() {
    musicHowl?.pause();
  },

  resumeMusic() {
    musicHowl?.play();
  },

  seekMusic(seconds: number) {
    musicHowl?.seek(seconds);
  },

  setMusicVolume(master: number, music: number) {
    musicVolume = master * music;
    if (musicHowl) musicHowl.volume(musicVolume);
  },

  getMusicDuration(): number {
    return (musicHowl?.duration() as number) ?? 0;
  },

  getMusicCurrentTime(): number {
    return (musicHowl?.seek() as number) ?? 0;
  },

  isMusicPlaying(): boolean {
    return musicHowl?.playing() ?? false;
  },

  onMusicEnded(cb: () => void) {
    musicEndedCb = cb;
  },

  onMusicTimeUpdate(cb: (t: number) => void) {
    musicTimeUpdateCb = cb;
  },

  stopMusic() {
    clearMusicHowl();
  },
};

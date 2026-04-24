import { useState, useRef } from "react";
import { useAudioStore } from "../audio/audioStore";
import { useSettingsStore } from "../settings/settingsStore";
import { audioService } from "../audio/audioService";
import { PLAYLIST, AMBIENT_TRACKS } from "../audio/audioRegistry";
import { ProgressBar } from "../../components/music/ProgressBar";
import { MusicLegendModal } from "./MusicLegendModal";
import { SpeakerIcon, SpeakerMutedIcon } from "../../components/PixelIcons";
import { Tooltip } from "../../components/Tooltip";
import { PixelSlider } from "../../components/PixelSlider";
import "./MusicPlayerView.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Pixel record SVG ────────────────────────────────────────────────────────
function RecordIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="0" width="10" height="2" fill="var(--color-border)" />
      <rect x="1" y="2" width="14" height="2" fill="var(--color-border)" />
      <rect x="0" y="4" width="16" height="8" fill="var(--color-border)" />
      <rect x="1" y="12" width="14" height="2" fill="var(--color-border)" />
      <rect x="3" y="14" width="10" height="2" fill="var(--color-border)" />
      {/* Inner ring */}
      <rect x="4" y="4" width="8" height="8" fill="var(--color-accent-purple)" />
      <rect x="5" y="3" width="6" height="10" fill="var(--color-accent-purple)" />
      {/* Center hole */}
      <rect x="6" y="6" width="4" height="4" fill="var(--color-bg)" />
      <rect x="7" y="5" width="2" height="6" fill="var(--color-bg)" />
    </svg>
  );
}

// ─── Controls ────────────────────────────────────────────────────────────────
function Controls({ onOpenLegend }: { onOpenLegend: () => void }) {
  const { isPlaying, isShuffle, repeatMode, togglePlayPause, skipNext, skipPrev, toggleShuffle, cycleRepeat } =
    useAudioStore();
  const { musicVolume, setMusicVolume, musicMuted, setMusicMuted } = useSettingsStore();
  // Remember the volume before muting so we can restore it on unmute
  const premuteVolumeRef = useRef(musicVolume > 0 ? musicVolume : 0.7);

  const handleMuteToggle = () => {
    if (musicMuted) {
      // Unmuting: restore previous volume
      setMusicMuted(false);
      if (musicVolume === 0) setMusicVolume(premuteVolumeRef.current);
    } else {
      // Muting: save current volume
      premuteVolumeRef.current = musicVolume || premuteVolumeRef.current;
      setMusicMuted(true);
    }
  };

  const handleVolumeChange = (v: number) => {
    if (v > 0 && musicMuted) setMusicMuted(false);
    if (v > 0) premuteVolumeRef.current = v;
    setMusicVolume(v);
  };

  const repeatLabel = repeatMode === "one" ? "⟳1" : repeatMode === "all" ? "⟳∞" : "⟳";
  const repeatActive = repeatMode !== "none";

  return (
    <div className="music-controls">
      <Tooltip text={isShuffle ? "Desactivar aleatorio" : "Aleatorio"} position="top">
        <button data-no-sfx className={`music-ctrl-btn ${isShuffle ? "active" : ""}`} onClick={toggleShuffle}>
          ⇌ MIX
        </button>
      </Tooltip>
      <Tooltip text="Anterior" position="top">
        <button data-no-sfx className="music-ctrl-btn" onClick={skipPrev}>
          ◄◄
        </button>
      </Tooltip>
      <Tooltip text={isPlaying ? "Pausar" : "Reproducir"} position="top">
        <button data-no-sfx className="music-ctrl-btn music-ctrl-btn--play" onClick={togglePlayPause}>
          {isPlaying ? "❙❙" : "▶"}
        </button>
      </Tooltip>
      <Tooltip text="Siguiente" position="top">
        <button data-no-sfx className="music-ctrl-btn" onClick={skipNext}>
          ►►
        </button>
      </Tooltip>
      <Tooltip text={repeatMode === "none" ? "Repetir todo" : repeatMode === "all" ? "Repetir una" : "No repetir"} position="top">
        <button data-no-sfx className={`music-ctrl-btn ${repeatActive ? "active" : ""}`} onClick={cycleRepeat}>
          {repeatLabel}
        </button>
      </Tooltip>
      <Tooltip text="Ver controles" position="top">
        <button data-no-sfx className="music-ctrl-btn" onClick={onOpenLegend} aria-label="Ver leyenda de controles">
          ⓘ
        </button>
      </Tooltip>

      {/* Volume Control */}
      <div className="music-volume-section">
        <Tooltip text={musicMuted ? "Desilenciar música" : "Silenciar música"} position="top">
          <button
            data-no-sfx
            className="pixel-btn-icon"
            style={{ width: "24px", height: "24px" }}
            onClick={handleMuteToggle}
          >
            {musicMuted || musicVolume === 0 ? <SpeakerMutedIcon size={14} /> : <SpeakerIcon size={14} />}
          </button>
        </Tooltip>
        <PixelSlider
          value={musicMuted ? 0 : musicVolume}
          onChange={handleVolumeChange}
          width={70}
        />
      </div>
    </div>
  );
}

// ─── Main view ───────────────────────────────────────────────────────────────
export function MusicPlayerView() {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const { currentTrackIndex, isPlaying, progressSeconds, activeAmbient } = useAudioStore();

  const currentTrack = currentTrackIndex !== null ? PLAYLIST[currentTrackIndex] : null;
  const duration = currentTrack
    ? audioService.getMusicDuration() || currentTrack.durationSeconds
    : 0;
  const ambientMeta = activeAmbient ? AMBIENT_TRACKS.find((t) => t.id === activeAmbient) : null;

  return (
    <div className="music-player">
      {/* Now Playing */}
      <div className="music-now-playing">
        <div className="music-record">
          <RecordIcon />
        </div>
        <div className="music-track-info">
          <span className="music-track-title">
            {currentTrack ? currentTrack.title.toUpperCase() : "SIN SELECCIÓN"}
          </span>
          <span className="music-track-artist">
            {currentTrack ? currentTrack.artist : "elige una canción"}
          </span>
          {currentTrack && isPlaying && (
            <span className="music-status-playing">♪ REPRODUCIENDO</span>
          )}
          {ambientMeta && (
            <span className="music-status-ambient">
              {ambientMeta.emoji} {ambientMeta.label} · ACTIVO
            </span>
          )}
        </div>
        <ProgressBar progress={progressSeconds} duration={duration} />
      </div>

      {/* Playback controls */}
      <Controls onOpenLegend={() => setIsLegendOpen(true)} />

      {/* Playlist */}
      <div className="music-playlist">
        {PLAYLIST.map((track, i) => (
          <div
            key={track.id}
            className={`music-track-row ${currentTrackIndex === i ? "active" : ""}`}
            onClick={() => useAudioStore.getState().playTrack(i)}
          >
            <span className="music-track-num">
              {currentTrackIndex === i && isPlaying ? "♪" : `${i + 1}`}
            </span>
            <div className="music-track-row-info">
              <span className="music-track-row-title">{track.title}</span>
              <span className="music-track-row-artist">{track.artist}</span>
            </div>
            <span className="music-track-row-dur">{formatTime(track.durationSeconds)}</span>
          </div>
        ))}
      </div>

      <MusicLegendModal isOpen={isLegendOpen} onClose={() => setIsLegendOpen(false)} />
    </div>
  );
}

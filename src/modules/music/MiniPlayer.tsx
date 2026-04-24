import { useRef } from "react";
import { useAudioStore } from "../audio/audioStore";
import { useSettingsStore } from "../settings/settingsStore";
import { audioService } from "../audio/audioService";
import { PLAYLIST } from "../audio/audioRegistry";
import { ProgressBar } from "../../components/music/ProgressBar";
import { Tooltip } from "../../components/Tooltip";
import { PixelSlider } from "../../components/PixelSlider";
import { SpeakerIcon, SpeakerMutedIcon } from "../../components/PixelIcons";
import "./MiniPlayer.css";

export function MiniPlayer({ onNavigateToMusic }: { onNavigateToMusic: () => void }) {
  const {
    currentTrackIndex,
    isPlaying,
    isShuffle,
    repeatMode,
    progressSeconds,
    togglePlayPause,
    skipNext,
    skipPrev,
    toggleShuffle,
    cycleRepeat,
  } = useAudioStore();
  const { musicVolume, setMusicVolume, musicMuted, setMusicMuted } = useSettingsStore();
  const premuteRef = useRef(musicVolume > 0 ? musicVolume : 0.7);

  const handleVolumeChange = (v: number) => {
    if (v > 0 && musicMuted) setMusicMuted(false);
    if (v > 0) premuteRef.current = v;
    setMusicVolume(v);
  };

  const handleMuteToggle = () => {
    if (musicMuted) {
      setMusicMuted(false);
      if (musicVolume === 0) setMusicVolume(premuteRef.current);
    } else {
      premuteRef.current = musicVolume || premuteRef.current;
      setMusicMuted(true);
    }
  };

  if (currentTrackIndex === null) return null;

  const track = PLAYLIST[currentTrackIndex];
  const duration = audioService.getMusicDuration() || track.durationSeconds;
  const repeatLabel = repeatMode === "one" ? "⟳1" : "⟳";
  const repeatActive = repeatMode !== "none";

  return (
    <div className="mini-player" data-no-sfx>

      {/* LEFT — track info */}
      <div className="mini-player__left">
        <div className="mini-player__track-info">
          <span className="mini-player__title">{track.title.toUpperCase()}</span>
          <span className="mini-player__artist">{track.artist}</span>
        </div>
      </div>

      {/* CENTER — seek + controls */}
      <div className="mini-player__center">
        <div className="mini-player__controls">
          <Tooltip text={isShuffle ? "Desactivar aleatorio" : "Aleatorio"} position="top">
            <button
              className={`mini-player__btn mini-player__btn--ghost ${isShuffle ? "mini-player__btn--active" : ""}`}
              onClick={toggleShuffle}
              aria-label="Aleatorio"
            >
              ⇌
            </button>
          </Tooltip>
          <Tooltip text="Anterior" position="top">
            <button className="mini-player__btn mini-player__btn--ghost" onClick={skipPrev} aria-label="Anterior">
              ◄◄
            </button>
          </Tooltip>
          <Tooltip text={isPlaying ? "Pausar" : "Reproducir"} position="top">
            <button
              className="mini-player__btn mini-player__btn--play"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? "❙❙" : "▶"}
            </button>
          </Tooltip>
          <Tooltip text="Siguiente" position="top">
            <button className="mini-player__btn mini-player__btn--ghost" onClick={skipNext} aria-label="Siguiente">
              ►►
            </button>
          </Tooltip>
          <Tooltip
            text={repeatMode === "none" ? "Repetir todo" : repeatMode === "all" ? "Repetir una" : "No repetir"}
            position="top"
          >
            <button
              className={`mini-player__btn mini-player__btn--ghost ${repeatActive ? "mini-player__btn--active" : ""}`}
              onClick={cycleRepeat}
              aria-label="Repetir"
            >
              {repeatLabel}
            </button>
          </Tooltip>
        </div>

        <div className="mini-player__seek">
          <ProgressBar progress={progressSeconds} duration={duration} showTimes={true} />
        </div>
      </div>

      {/* RIGHT — volume + window actions */}
      <div className="mini-player__right">
        <Tooltip text={musicMuted ? "Desilenciar" : "Silenciar"} position="top">
          <button className="mini-player__btn mini-player__btn--ghost" onClick={handleMuteToggle} aria-label="Volumen">
            {musicMuted || musicVolume === 0 ? <SpeakerMutedIcon size={13} /> : <SpeakerIcon size={13} />}
          </button>
        </Tooltip>
        <div className="mini-player__volume">
          <PixelSlider value={musicMuted ? 0 : musicVolume} onChange={handleVolumeChange} width={72} />
        </div>

        <div className="mini-player__window-actions">
          <Tooltip text="Ventana flotante (próximamente)" position="top" align="end">
            <button
              className="mini-player__btn mini-player__btn--ghost mini-player__btn--disabled"
              aria-label="Ventana flotante"
              disabled
            >
              ⧉
            </button>
          </Tooltip>
          <Tooltip text="Abrir MÚSICA" position="top" align="end">
            <button
              className="mini-player__btn mini-player__btn--ghost"
              onClick={onNavigateToMusic}
              aria-label="Abrir MÚSICA"
            >
              ⛶
            </button>
          </Tooltip>
        </div>
      </div>

    </div>
  );
}

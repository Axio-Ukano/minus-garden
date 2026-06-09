import { useRef } from "react";
import { useAudioStore, audioService, PLAYLIST } from "@/modules/audio";
import { useSettingsStore } from "@/modules/settings";
import { ProgressBar } from "./ProgressBar";
import { Tooltip } from "../../components/Tooltip";
import { PixelSlider } from "../../components/PixelSlider";
import { SpeakerIcon, SpeakerMutedIcon } from "../../components/PixelIcons";
import { useTranslation } from "../../i18n";
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
  const { t } = useTranslation();
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
  if (!track) return null;
  const duration = audioService.getMusicDuration() || track.durationSeconds;
  const repeatLabel = repeatMode === "one" ? "⟳1" : repeatMode === "all" ? "⟳∞" : "⟳";
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
          <Tooltip text={isShuffle ? t.music.shuffle_on : t.music.shuffle_off} position="top">
            <button
              className={`mini-player__btn mini-player__btn--ghost ${isShuffle ? "mini-player__btn--active" : ""}`}
              onClick={toggleShuffle}
              aria-label={isShuffle ? t.music.shuffle_on : t.music.shuffle_off}
            >
              ⇌
            </button>
          </Tooltip>
          <Tooltip text={t.music.prev} position="top">
            <button
              className="mini-player__btn mini-player__btn--ghost"
              onClick={skipPrev}
              aria-label={t.music.prev}
            >
              ◄◄
            </button>
          </Tooltip>
          <Tooltip text={isPlaying ? t.music.pause : t.music.play} position="top">
            <button
              className="mini-player__btn mini-player__btn--play"
              onClick={togglePlayPause}
              aria-label={isPlaying ? t.music.pause : t.music.play}
            >
              {isPlaying ? "❙❙" : "▶"}
            </button>
          </Tooltip>
          <Tooltip text={t.music.next} position="top">
            <button
              className="mini-player__btn mini-player__btn--ghost"
              onClick={skipNext}
              aria-label={t.music.next}
            >
              ►►
            </button>
          </Tooltip>
          <Tooltip
            text={
              repeatMode === "none"
                ? t.music.repeat_all
                : repeatMode === "all"
                  ? t.music.repeat_one
                  : t.music.repeat_none
            }
            position="top"
          >
            <button
              className={`mini-player__btn mini-player__btn--ghost ${repeatActive ? "mini-player__btn--active" : ""}`}
              onClick={cycleRepeat}
              aria-label={t.music.legend_repeat_name}
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
        <Tooltip text={musicMuted ? t.music.unmute : t.music.mute} position="top">
          <button
            className="mini-player__btn mini-player__btn--ghost"
            onClick={handleMuteToggle}
            aria-label={t.music.mute_aria}
          >
            {musicMuted || musicVolume === 0 ? (
              <SpeakerMutedIcon size={13} />
            ) : (
              <SpeakerIcon size={13} />
            )}
          </button>
        </Tooltip>
        <div className="mini-player__volume">
          <PixelSlider
            value={musicMuted ? 0 : musicVolume}
            onChange={handleVolumeChange}
            width={72}
          />
        </div>

        <div className="mini-player__window-actions">
          <Tooltip text={t.music.float_soon} position="top" align="end">
            <button
              className="mini-player__btn mini-player__btn--ghost mini-player__btn--disabled"
              aria-label={t.music.float_aria}
              disabled
            >
              ⧉
            </button>
          </Tooltip>
          <Tooltip text={t.music.open_music} position="top" align="end">
            <button
              className="mini-player__btn mini-player__btn--ghost"
              onClick={onNavigateToMusic}
              aria-label={t.music.open_music}
            >
              ⛶
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

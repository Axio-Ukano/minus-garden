import { useAudioStore } from "../../modules/audio/audioStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek?: (seconds: number) => void;
  showTimes?: boolean;
  compact?: boolean;
}

export function ProgressBar({
  progress,
  duration,
  onSeek,
  showTimes = true,
  compact = false,
}: ProgressBarProps) {
  const percent = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const seek = onSeek ?? useAudioStore.getState().seekTo;
    seek(ratio * duration);
  };

  if (compact) {
    return (
      <div className="music-progress-bar-track" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="music-progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    );
  }

  return (
    <div className="music-progress-wrap">
      <div className="music-progress-bar-track" onClick={handleClick}>
        <div className="music-progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      {showTimes && (
        <div className="music-progress-times">
          <span className="music-time">{formatTime(progress)}</span>
          <span className="music-time">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}

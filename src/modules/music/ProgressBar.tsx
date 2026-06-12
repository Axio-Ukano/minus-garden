// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useAudioStore } from "@/modules/audio";
import { formatTime } from "./utils";

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

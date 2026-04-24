import { useEffect, useRef } from "react";
import { useTimerStore } from "../timerStore";
import { getSpeciesById } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { usePlantGrowth } from "../../plants/usePlantGrowth";
import { useSettingsStore } from "../../settings/settingsStore";
import { audioService } from "../../audio/audioService";
import { TimerCircle } from "../components/TimerCircle";
import "./TimerViews.css";

export function TimerActiveView() {
  const { status, durationMinutes, secondsLeft, subject, plantSpeciesId, pause, resume, reset } =
    useTimerStore();

  const species = getSpeciesById(plantSpeciesId);
  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, species);
  const plantSide = useSettingsStore((s) => s.plantSide);
  const { masterVolume, sfxVolume } = useSettingsStore();

  const prevStageRef = useRef(growthState.currentStage);
  useEffect(() => {
    if (growthState.currentStage > prevStageRef.current) {
      audioService.playSfx("plant_grow", masterVolume, sfxVolume);
    }
    prevStageRef.current = growthState.currentStage;
  }, [growthState.currentStage, masterVolume, sfxVolume]);

  const isPaused = status === "paused";

  return (
    <div className="timer-view">
      <div className="timer-view__grid">
        {/* ── Controls column ── */}
        <div
          className="timer-view__col timer-view__col--controls"
          style={{ order: plantSide === "left" ? 2 : 1 }}
        >
          <TimerCircle secondsLeft={secondsLeft} totalSeconds={totalSeconds} faded={isPaused} />

          <div className="timer-view__status">
            {subject.trim() && (
              <span className="timer-view__subject-label">{subject.toUpperCase()}</span>
            )}
            {isPaused && <span className="timer-view__paused-badge">PAUSADO</span>}
          </div>
        </div>

        {/* ── Plant column ── */}
        <div
          className="timer-view__col timer-view__col--plant"
          style={{ order: plantSide === "left" ? 1 : 2 }}
        >
          <div className="timer-view__plant-inner">
            <div className="timer-view__plant-sprite">
              <PlantDisplay stage={growthState.currentStage} speciesId={plantSpeciesId} size="xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Controls Bar ── */}
      <div className="timer-view__bottom-bar">
        {isPaused ? (
          <>
            <button className="pixel-btn" onClick={resume}>
              REANUDAR
            </button>
            <button className="pixel-btn-secondary" onClick={reset}>
              CANCELAR
            </button>
          </>
        ) : (
          <>
            <button className="pixel-btn" onClick={pause}>
              PAUSAR
            </button>
            <button className="pixel-btn-secondary" onClick={reset}>
              CANCELAR
            </button>
          </>
        )}
      </div>
    </div>
  );
}

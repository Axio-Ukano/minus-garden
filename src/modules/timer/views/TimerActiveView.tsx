import { useEffect, useRef } from "react";
import { useTimerStore } from "../timerStore";
import { getSpeciesById } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { usePlantGrowth } from "../../plants/usePlantGrowth";
import { useSettingsStore } from "../../settings/settingsStore";
import { audioService } from "../../audio/audioService";

import { TimerCircle } from "../components/TimerCircle";

export function TimerActiveView() {
  const { status, durationMinutes, secondsLeft, subject, plantSpeciesId, pause, resume, reset } =
    useTimerStore();

  const species = getSpeciesById(plantSpeciesId);
  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, species);
  const plantSide = useSettingsStore((s) => s.plantSide);
  const { masterVolume, sfxVolume } = useSettingsStore();

  // Fire SFX when plant advances to a new stage
  const prevStageRef = useRef(growthState.currentStage);
  useEffect(() => {
    if (growthState.currentStage > prevStageRef.current) {
      audioService.playSfx("plant_grow", masterVolume, sfxVolume);
    }
    prevStageRef.current = growthState.currentStage;
  }, [growthState.currentStage, masterVolume, sfxVolume]);

  const isPaused = status === "paused";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        backgroundColor: "var(--color-bg)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          paddingTop: 16,
        }}
      >
        {/* ── Controls column ── */}
        <div
          style={{
            padding: "16px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 20,
            order: plantSide === "left" ? 2 : 1,
          }}
        >
          <div>
            <TimerCircle secondsLeft={secondsLeft} totalSeconds={totalSeconds} faded={isPaused} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {subject.trim() && (
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "var(--text-pixel-md)",
                  color: "var(--color-text)",
                  letterSpacing: "0.1em",
                  textAlign: "center",
                }}
              >
                {subject.toUpperCase()}
              </span>
            )}
            {isPaused && (
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "var(--text-pixel-xs)",
                  color: "var(--color-heart)",
                  border: "2px solid var(--color-heart)",
                  padding: "3px 8px",
                  letterSpacing: "0.1em",
                }}
              >
                PAUSADO
              </span>
            )}
          </div>
        </div>

        {/* ── Plant column ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 32px",
            gap: 20,
            order: plantSide === "left" ? 1 : 2,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 140,
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlantDisplay stage={growthState.currentStage} speciesId={plantSpeciesId} size="xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Controls Bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          backgroundColor: "var(--color-panel)",
          borderTop: "3px solid var(--color-border)",
        }}
      >
        {isPaused ? (
          <>
            <button
              className="pixel-btn"
              onClick={resume}
              style={{ flex: 1, justifyContent: "center", maxWidth: 200 }}
            >
              REANUDAR
            </button>
            <button
              className="pixel-btn-secondary"
              onClick={reset}
              style={{ flex: 1, justifyContent: "center", maxWidth: 200 }}
            >
              CANCELAR
            </button>
          </>
        ) : (
          <>
            <button
              className="pixel-btn"
              onClick={pause}
              style={{ flex: 1, justifyContent: "center", maxWidth: 200 }}
            >
              PAUSAR
            </button>
            <button
              className="pixel-btn-secondary"
              onClick={reset}
              style={{ flex: 1, justifyContent: "center", maxWidth: 200 }}
            >
              CANCELAR
            </button>
          </>
        )}
      </div>
    </div>
  );
}

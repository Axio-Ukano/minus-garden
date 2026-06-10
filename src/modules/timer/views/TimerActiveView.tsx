// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useRef } from "react";
import { useTimerStore } from "../timerStore";
import { getSpeciesById, PlantDisplay, usePlantGrowth } from "@/modules/plants";
import { useSettingsStore } from "@/modules/settings";
import { audioService } from "@/modules/audio";
import { TimerCircle } from "../components/TimerCircle";
import { useTranslation } from "../../../i18n";
import "./TimerViews.css";

export function TimerActiveView() {
  const { status, durationMinutes, secondsLeft, subject, plantSpeciesId, pause, resume, reset } =
    useTimerStore();

  const species = getSpeciesById(plantSpeciesId);
  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, species);
  const plantSide = useSettingsStore((s) => s.plantSide);
  const { t } = useTranslation();

  const prevStageRef = useRef(growthState.currentStage);
  useEffect(() => {
    if (growthState.currentStage > prevStageRef.current) {
      const s = useSettingsStore.getState();
      audioService.playSfx(
        "plant_grow",
        s.masterMuted ? 0 : s.masterVolume,
        s.sfxMuted ? 0 : s.sfxVolume
      );
    }
    prevStageRef.current = growthState.currentStage;
  }, [growthState.currentStage]);

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
            {isPaused && <span className="timer-view__paused-badge">{t.timer.paused_badge}</span>}
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
              {t.timer.resume}
            </button>
            <button className="pixel-btn-secondary" onClick={reset}>
              {t.timer.cancel}
            </button>
          </>
        ) : (
          <>
            <button className="pixel-btn" onClick={pause}>
              {t.timer.pause}
            </button>
            <button className="pixel-btn-secondary" onClick={reset}>
              {t.timer.cancel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

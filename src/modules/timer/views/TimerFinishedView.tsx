// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useTimerStore } from "../timerStore";
import {
  getSpeciesById,
  getStageName,
  getPlantName,
  calculateHeartsEarned,
  calculateFinalStage,
} from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { HeartIcon } from "@/components/PixelIcons";
import { useTranslation } from "../../../i18n";
import "./TimerViews.css";

export function TimerFinishedView({ onNavigateToHistory }: { onNavigateToHistory: () => void }) {
  const { durationMinutes, plantSpeciesId, reset } = useTimerStore();
  const { t } = useTranslation();

  const species = getSpeciesById(plantSpeciesId);
  // Same rule the saved session used (applies unlockThreshold), so the
  // finished screen and the history entry always show the same stage.
  const finalStage = calculateFinalStage(durationMinutes, species);
  const stageName = getStageName(finalStage, species, t);
  const plantName = getPlantName(species, t);
  const heartsEarned = calculateHeartsEarned(durationMinutes);

  return (
    <div className="timer-finished" data-testid="timer-finished">
      <div className="timer-finished__title">{t.timer.session_complete}</div>

      <PlantDisplay stage={finalStage} speciesId={plantSpeciesId} size="lg" />

      <div className="timer-finished__info">
        <div className="timer-finished__stage-name">
          {t.timer.stage_label} {finalStage} — {stageName.toUpperCase()}
        </div>
        <div className="timer-finished__meta">
          {plantName.toUpperCase()} · {durationMinutes} {t.timer.min_abbr}
        </div>
      </div>

      {heartsEarned > 0 && (
        <div className="timer-finished__hearts" data-testid="finished-hearts">
          +{heartsEarned} <HeartIcon size={16} color="var(--color-heart)" />
        </div>
      )}

      <div className="timer-finished__actions">
        <button
          data-testid="finished-view-history"
          className="pixel-btn-secondary"
          onClick={onNavigateToHistory}
        >
          {t.timer.view_history}
        </button>
        <button className="pixel-btn" onClick={reset}>
          {t.timer.new_session}
        </button>
      </div>
    </div>
  );
}

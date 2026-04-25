import { useTimerStore } from "../timerStore";
import { getSpeciesById, getStageName, getPlantName } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { HeartIcon } from "../../../components/HeartIcon";
import { usePlantGrowth } from "../../plants/usePlantGrowth";
import { useTranslation } from "../../../i18n";
import "./TimerViews.css";

export function TimerFinishedView({ onNavigateToHistory }: { onNavigateToHistory: () => void }) {
  const { durationMinutes, secondsLeft, plantSpeciesId, reset } = useTimerStore();
  const { t } = useTranslation();

  const species = getSpeciesById(plantSpeciesId);
  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, species);
  const stageName = getStageName(growthState.currentStage, species, t);
  const plantName = getPlantName(species, t);
  const heartsEarned = Math.floor(durationMinutes / 5);

  return (
    <div className="timer-finished">
      <div className="timer-finished__title">{t.timer.session_complete}</div>

      <PlantDisplay stage={growthState.currentStage} speciesId={plantSpeciesId} size="lg" />

      <div className="timer-finished__info">
        <div className="timer-finished__stage-name">
          {t.timer.stage_label} {growthState.currentStage} — {stageName.toUpperCase()}
        </div>
        <div className="timer-finished__meta">
          {plantName.toUpperCase()} · {durationMinutes} {t.timer.min_abbr}
        </div>
      </div>

      {heartsEarned > 0 && (
        <div className="timer-finished__hearts">
          +{heartsEarned} <HeartIcon size={16} color="var(--color-heart)" />
        </div>
      )}

      <div className="timer-finished__actions">
        <button className="pixel-btn-secondary" onClick={onNavigateToHistory}>
          {t.timer.view_history}
        </button>
        <button className="pixel-btn" onClick={reset}>
          {t.timer.new_session}
        </button>
      </div>
    </div>
  );
}
import { useTimerStore } from "../timerStore";
import { getSpeciesById, getStageName } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { HeartIcon } from "../../../components/HeartIcon";
import { usePlantGrowth } from "../../plants/usePlantGrowth";
import "./TimerViews.css";

export function TimerFinishedView({ onNavigateToHistory }: { onNavigateToHistory: () => void }) {
  const { durationMinutes, secondsLeft, plantSpeciesId, reset } = useTimerStore();

  const species = getSpeciesById(plantSpeciesId);
  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, species);
  const stageName = getStageName(growthState.currentStage, species);
  const heartsEarned = Math.floor(durationMinutes / 5);

  return (
    <div className="timer-finished">
      <div className="timer-finished__title">✦ SESIÓN COMPLETADA ✦</div>

      <PlantDisplay stage={growthState.currentStage} speciesId={plantSpeciesId} size="lg" />

      <div className="timer-finished__info">
        <div className="timer-finished__stage-name">
          ETAPA {growthState.currentStage} — {stageName.toUpperCase()}
        </div>
        <div className="timer-finished__meta">
          {species.name.toUpperCase()} · {durationMinutes} MIN
        </div>
      </div>

      {heartsEarned > 0 && (
        <div className="timer-finished__hearts">
          +{heartsEarned} <HeartIcon size={16} color="var(--color-heart)" />
        </div>
      )}

      <div className="timer-finished__actions">
        <button className="pixel-btn-secondary" onClick={onNavigateToHistory}>
          VER EN HISTORIAL
        </button>
        <button className="pixel-btn" onClick={reset}>
          NUEVA SESIÓN
        </button>
      </div>
    </div>
  );
}

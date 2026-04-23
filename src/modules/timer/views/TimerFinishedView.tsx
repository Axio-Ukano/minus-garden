import { useTimerStore } from "../timerStore";
import { getSpeciesById, getStageName } from "../../plants/plantService";
import { PlantDisplay } from "../../plants/PlantDisplay";
import { HeartIcon } from "../../../components/HeartIcon";
import { usePlantGrowth } from "../../plants/usePlantGrowth";

export function TimerFinishedView({ onNavigateToHistory }: { onNavigateToHistory: () => void }) {
  const { durationMinutes, secondsLeft, plantSpeciesId, reset } = useTimerStore();

  const species = getSpeciesById(plantSpeciesId);
  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, species);
  const stageName = getStageName(growthState.currentStage, species);
  const heartsEarned = Math.floor(durationMinutes / 5);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        backgroundColor: "var(--color-bg)",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-lg)",
          color: "var(--color-accent-pink)",
          textAlign: "center",
        }}
      >
        ✦ SESIÓN COMPLETADA ✦
      </div>

      <PlantDisplay stage={growthState.currentStage} speciesId={plantSpeciesId} size="lg" />

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-sm)",
            color: "var(--color-text)",
            letterSpacing: "0.05em",
          }}
        >
          ETAPA {growthState.currentStage} — {stageName.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          {species.name.toUpperCase()} · {durationMinutes} MIN
        </div>
      </div>

      {heartsEarned > 0 && (
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-md)",
            color: "var(--color-heart)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          +{heartsEarned} <HeartIcon size={16} color="var(--color-heart)" />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <button
          className="pixel-btn-secondary"
          onClick={onNavigateToHistory}
          style={{ width: 220 }}
        >
          VER EN HISTORIAL
        </button>
        <button className="pixel-btn" onClick={reset} style={{ width: 220 }}>
          NUEVA SESIÓN
        </button>
      </div>
    </div>
  );
}

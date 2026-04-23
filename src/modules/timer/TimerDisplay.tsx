import { useRef, useState } from "react";
import { useTimerStore } from "./timerStore";
import { useTimer } from "./useTimer";
import { useHistoryStore } from "../history/historyStore";
import { usePlantGrowth } from "../plant/usePlantGrowth";
import { PlantDisplay } from "../plant/PlantDisplay";
import { DAISY_SPECIES, getStageName } from "../plant/plantService";

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DURATION_MIN = 15;
const DURATION_MAX = 300;
const DURATION_STEP = 5;

function clampDuration(v: number) {
  return Math.max(DURATION_MIN, Math.min(DURATION_MAX, Math.round(v / DURATION_STEP) * DURATION_STEP));
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DurationSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [inputVal, setInputVal] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    const clamped = clampDuration(isNaN(n) ? value : n);
    onChange(clamped);
    setInputVal(String(clamped));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      <button
        className="pixel-btn-secondary"
        onClick={() => {
          const next = clampDuration(value - DURATION_STEP);
          onChange(next);
          setInputVal(String(next));
        }}
        style={{ minWidth: 36, justifyContent: "center" }}
      >
        −
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <input
          ref={inputRef}
          className="pixel-input"
          style={{ width: 56, textAlign: "center", padding: "8px 4px" }}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(inputVal); }}
        />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
            marginLeft: 6,
          }}
        >
          MIN
        </span>
      </div>
      <button
        className="pixel-btn-secondary"
        onClick={() => {
          const next = clampDuration(value + DURATION_STEP);
          onChange(next);
          setInputVal(String(next));
        }}
        style={{ minWidth: 36, justifyContent: "center" }}
      >
        +
      </button>
    </div>
  );
}

export function TimerDisplay() {
  useTimer();

  const {
    status,
    durationMinutes,
    secondsLeft,
    subject,
    start,
    pause,
    resume,
    reset,
    setDuration,
    setSubject,
  } = useTimerStore();

  const totalHearts = useHistoryStore((s) => s.totalHearts);

  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;
  const progress = secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const growthState = usePlantGrowth(elapsedSeconds, DAISY_SPECIES);
  const stageName = getStageName(growthState.currentStage, DAISY_SPECIES.id);

  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isFinished = status === "finished";

  return (
    <div
      className="pixel-panel flex flex-col items-center justify-center min-h-screen gap-6"
      style={{ backgroundColor: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Hearts display */}
      <div className="flex items-center gap-1" style={{ color: "var(--color-heart)" }}>
        {totalHearts > 0 && (
          <>
            <span className="text-2xl">{"♥".repeat(Math.min(totalHearts, 10))}</span>
            {totalHearts > 10 && (
              <span className="text-sm font-bold" style={{ color: "var(--color-text-muted)" }}>
                +{totalHearts - 10}
              </span>
            )}
          </>
        )}
      </div>

      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="var(--color-accent-pink)"
            strokeWidth="10"
            opacity="0.35"
          />
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke={isFinished ? "var(--color-accent-green)" : "var(--color-accent-green)"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isFinished ? CIRCUMFERENCE : dashOffset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          {isFinished ? (
            <span className="text-4xl">💗</span>
          ) : (
            <span
              className="text-5xl font-extrabold tracking-tight"
              style={{ color: "var(--color-text)" }}
            >
              {formatTime(secondsLeft)}
            </span>
          )}
          {subject && !isFinished && (
            <span
              className="text-xs font-semibold mt-1 max-w-[120px] text-center truncate"
              style={{ color: "var(--color-text-muted)" }}
            >
              {subject}
            </span>
          )}
        </div>
      </div>

      {/* Plant display */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <PlantDisplay stage={growthState.currentStage} size="lg" />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          {`ETAPA ${growthState.currentStage} — ${stageName.toUpperCase()}`}
          {growthState.isMaxStage && " ✦ MAX"}
        </span>
      </div>

      {/* Finished message */}
      {isFinished && (
        <div
          className="text-xl font-bold text-center px-6 py-3"
          style={{
            backgroundColor: "var(--color-surface)",
            color: "var(--color-accent-green)",
            border: "3px solid var(--color-border)",
            boxShadow: "3px 3px 0 var(--color-pixel-shadow)",
          }}
        >
          ¡Lo lograste!
          {Math.floor(durationMinutes / 5) > 0 && (
            <p
              className="text-sm font-semibold mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              +{Math.floor(durationMinutes / 5)} ♥ ganados
            </p>
          )}
        </div>
      )}

      {/* Subject input */}
      {(isIdle || isPaused) && (
        <input
          type="text"
          placeholder="¿Qué estás estudiando?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="pixel-input"
          style={{ width: 240, textAlign: "center" }}
        />
      )}

      {/* Duration selector — only when idle */}
      {isIdle && (
        <DurationSelector value={durationMinutes} onChange={setDuration} />
      )}

      {/* Control buttons */}
      <div className="flex gap-3">
        {isIdle && (
          <button className="pixel-btn" onClick={start}>INICIAR</button>
        )}
        {isRunning && (
          <button className="pixel-btn-secondary" onClick={pause}>PAUSAR</button>
        )}
        {isPaused && (
          <button className="pixel-btn" onClick={resume}>REANUDAR</button>
        )}
        {(isRunning || isPaused || isFinished) && (
          <button className="pixel-btn-secondary" onClick={reset}>REINICIAR</button>
        )}
      </div>
    </div>
  );
}

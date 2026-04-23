import { useEffect, useRef, useState } from "react";
import { useTimerStore } from "./timerStore";
import { useTimer } from "./useTimer";
import { useHistoryStore } from "../history/historyStore";
import { usePlantGrowth } from "../plant/usePlantGrowth";
import { PlantDisplay } from "../plant/PlantDisplay";
import { DAISY_SPECIES, getStageName } from "../plant/plantService";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DURATION_MIN = 15;
const DURATION_MAX = 300;
const DURATION_STEP = 5;

function clampDuration(v: number) {
  const snapped = Math.round(v / DURATION_STEP) * DURATION_STEP;
  return Math.max(DURATION_MIN, Math.min(DURATION_MAX, snapped));
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

  useEffect(() => {
    setInputVal(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    const clamped = clampDuration(isNaN(n) ? value : n);
    setInputVal(String(clamped));
    onChange(clamped);
  };

  const decrement = () => onChange(clampDuration(value - DURATION_STEP));
  const increment = () => onChange(clampDuration(value + DURATION_STEP));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        className="pixel-btn-secondary"
        onClick={decrement}
        style={{ padding: "8px 14px", justifyContent: "center" }}
      >
        −
      </button>
      <input
        ref={inputRef}
        className="pixel-input"
        style={{
          width: 52,
          textAlign: "center",
          padding: "8px 4px",
          borderLeft: "none",
          borderRight: "none",
        }}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit(inputVal);
            inputRef.current?.blur();
          }
        }}
      />
      <button
        className="pixel-btn-secondary"
        onClick={increment}
        style={{ padding: "8px 14px", justifyContent: "center" }}
      >
        +
      </button>
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-xs)",
          color: "var(--color-text-muted)",
          marginLeft: 8,
        }}
      >
        MIN
      </span>
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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        gap: "var(--space-md)",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Hearts */}
      {totalHearts > 0 && (
        <div style={{ fontSize: 20, color: "var(--color-heart)", letterSpacing: 2 }}>
          {"♥".repeat(Math.min(totalHearts, 10))}
          {totalHearts > 10 && (
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xs)",
                color: "var(--color-text-muted)",
                marginLeft: 6,
              }}
            >
              +{totalHearts - 10}
            </span>
          )}
        </div>
      )}

      {/* Circular timer */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none"
            stroke="var(--color-accent-pink)"
            strokeWidth="10"
            opacity="0.3"
          />
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none"
            stroke="var(--color-accent-green)"
            strokeWidth="10"
            strokeLinecap="square"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isFinished ? 0 : dashOffset}
            style={{ transition: "stroke-dashoffset 0.8s linear" }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {isFinished ? (
            <span style={{ fontSize: 36 }}>💗</span>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xl)",
                color: "var(--color-text)",
              }}
            >
              {formatTime(secondsLeft)}
            </span>
          )}
          {subject && !isFinished && (
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xs)",
                color: "var(--color-text-muted)",
                maxWidth: 110,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subject}
            </span>
          )}
        </div>
      </div>

      {/* Plant */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-sm)" }}>
        <PlantDisplay stage={growthState.currentStage} size="lg" />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.08em",
          }}
        >
          {`ETAPA ${growthState.currentStage} — ${stageName.toUpperCase()}`}
          {growthState.isMaxStage && " ✦ MAX"}
        </span>
      </div>

      {/* Finished banner */}
      {isFinished && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "3px solid var(--color-border)",
            boxShadow: "3px 3px 0 var(--color-pixel-shadow)",
            padding: "12px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-sm)",
              color: "var(--color-accent-green)",
            }}
          >
            ¡LO LOGRASTE!
          </div>
          {Math.floor(durationMinutes / 5) > 0 && (
            <div
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xs)",
                color: "var(--color-heart)",
                marginTop: 8,
              }}
            >
              +{Math.floor(durationMinutes / 5)} ♥ GANADOS
            </div>
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
          style={{ width: 260, textAlign: "center" }}
        />
      )}

      {/* Duration selector — idle only */}
      {isIdle && <DurationSelector value={durationMinutes} onChange={setDuration} />}

      {/* Control buttons */}
      <div style={{ display: "flex", gap: 12 }}>
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

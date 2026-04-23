import { useEffect, useRef, useState } from "react";
import { useTimerStore } from "./timerStore";
import { useTimer } from "./useTimer";
import { useHistoryStore } from "../history/historyStore";
import { usePlantGrowth } from "../plant/usePlantGrowth";
import { PlantDisplay } from "../plant/PlantDisplay";
import { DAISY_SPECIES, getStageName } from "../plant/plantService";
import { useSubjectStore } from "../subjects/subjectStore";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DURATION_MIN = 5;
const DURATION_MAX = 300;
const DURATION_STEP = 5;

function stepDuration(v: number) {
  const snapped = Math.round(v / DURATION_STEP) * DURATION_STEP;
  return Math.max(DURATION_MIN, Math.min(DURATION_MAX, snapped));
}

function clampDuration(v: number) {
  return Math.max(DURATION_MIN, Math.min(DURATION_MAX, v));
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
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
    if (document.activeElement !== inputRef.current) {
      setInputVal(String(value));
    }
  }, [value]);

  const commit = (raw: string) => {
    const n = parseInt(raw.trim(), 10);
    const clamped = clampDuration(isNaN(n) ? 0 : n);
    setInputVal(String(clamped));
    onChange(clamped);
  };

  const decrement = () => onChange(stepDuration(value - DURATION_STEP));
  const increment = () => onChange(stepDuration(value + DURATION_STEP));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className="pixel-btn-secondary"
          onClick={decrement}
          style={{ padding: "8px 16px", justifyContent: "center" }}
        >
          −
        </button>
        <input
          ref={inputRef}
          className="pixel-input"
          style={{ width: 64, textAlign: "center", padding: "8px 4px" }}
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
          style={{ padding: "8px 16px", justifyContent: "center" }}
        >
          +
        </button>
      </div>
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-xs)",
          color: "var(--color-text-muted)",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        MINUTOS
      </span>
    </div>
  );
}

// ─── Shared label style ───────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-pixel)",
  fontSize: "var(--text-pixel-xs)",
  color: "var(--color-text-muted)",
  letterSpacing: "0.1em",
};

// ─── Circular timer SVG ───────────────────────────────────────────────────────
function TimerCircle({
  secondsLeft,
  totalSeconds,
  faded,
}: {
  secondsLeft: number;
  totalSeconds: number;
  faded?: boolean;
}) {
  const progress = secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: faded ? 0.6 : 1,
      }}
    >
      <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="100" cy="100" r={RADIUS}
          fill="none"
          stroke="var(--color-heart)"
          strokeWidth="10"
          opacity="0.25"
        />
        <circle
          cx="100" cy="100" r={RADIUS}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="10"
          strokeLinecap="butt"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
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
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xl)",
            color: "var(--color-text)",
          }}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TimerDisplay({ onNavigateToHistory }: { onNavigateToHistory: () => void }) {
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
  const { subjects, isLoaded, addSubject, markUsed } = useSubjectStore();

  // New-subject inline input state
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const newInputRef = useRef<HTMLInputElement>(null);

  const totalSeconds = durationMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;

  const growthState = usePlantGrowth(elapsedSeconds, DAISY_SPECIES);
  const stageName = getStageName(growthState.currentStage, DAISY_SPECIES.id);

  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isFinished = status === "finished";

  // Focus new-name input when shown
  useEffect(() => {
    if (addingNew) newInputRef.current?.focus();
  }, [addingNew]);

  const confirmNewSubject = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setAddingNew(false);
      return;
    }
    await addSubject(trimmed);
    setSubject(trimmed);
    setNewName("");
    setAddingNew(false);
  };

  const handleSelectChange = (value: string) => {
    if (value === "__new__") {
      setAddingNew(true);
    } else {
      const found = subjects.find((s) => s.id === value);
      if (found) {
        setSubject(found.name);
        markUsed(found.id);
      }
    }
  };

  // ── FINISHED state — full-screen celebration ──────────────────────────────
  if (isFinished) {
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

        <PlantDisplay stage={growthState.currentStage} size="lg" />

        <div className="pixel-panel" style={{ textAlign: "center", padding: "16px 24px" }}>
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-sm)",
              color: "var(--color-text)",
            }}
          >
            ETAPA {growthState.currentStage} — {stageName.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-xs)",
              color: "var(--color-text-muted)",
              marginTop: 4,
            }}
          >
            MARGARITA · {durationMinutes} MIN
          </div>
        </div>

        {heartsEarned > 0 && (
          <div
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-md)",
              color: "var(--color-heart)",
            }}
          >
            +{heartsEarned} ♥
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

  // ── Two-column layout (IDLE / RUNNING / PAUSED) ───────────────────────────
  const showBottomBar = isRunning || isPaused;

  // Find currently selected subject id for the <select>
  const selectedSubjectId =
    subjects.find((s) => s.name === subject)?.id ?? "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        boxSizing: "border-box",
      }}
    >
      {/* Hearts bar */}
      <div
        style={{
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          opacity: totalHearts === 0 ? 0.3 : 1,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-heart)",
            letterSpacing: "0.05em",
          }}
        >
          ♥ × {totalHearts}
        </span>
      </div>

      {/* Main two-column area */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: 0,
          height: "100%",
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            overflow: "hidden",
          }}
        >
          {isIdle && (
            /* IDLE left: plant preview */
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={labelStyle}>PLANTA DE SESIÓN</span>
              <PlantDisplay stage={1} size="md" />
              <span
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "var(--text-pixel-sm)",
                  color: "var(--color-text)",
                  letterSpacing: "0.05em",
                }}
              >
                MARGARITA
              </span>
              <span style={labelStyle}>5 ETAPAS · HASTA 120 MIN</span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-pixel)",
                  fontSize: "var(--text-pixel-xs)",
                  color: "var(--color-accent-pink)",
                  padding: 0,
                  letterSpacing: "0.05em",
                  textAlign: "left",
                }}
              >
                VER ETAPAS ›
              </button>
            </div>
          )}

          {(isRunning || isPaused) && (
            /* RUNNING / PAUSED left: circular timer */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ ...labelStyle, color: "var(--color-text)" }}>
                {subject.toUpperCase()}
              </span>
              {isPaused && (
                <span
                  style={{
                    ...labelStyle,
                    color: "var(--color-heart)",
                    letterSpacing: "0.15em",
                  }}
                >
                  — PAUSADO —
                </span>
              )}
              <TimerCircle
                secondsLeft={secondsLeft}
                totalSeconds={totalSeconds}
                faded={isPaused}
              />
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            borderLeft: "3px solid var(--color-border)",
            overflow: "hidden",
          }}
        >
          {isIdle && (
            /* IDLE right: subject + duration + start */
            <>
              {/* Subject selector */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={labelStyle}>MATERIA</span>
                {isLoaded && subjects.length > 0 ? (
                  <>
                    {!addingNew ? (
                      <select
                        className="pixel-input"
                        value={selectedSubjectId}
                        onChange={(e) => handleSelectChange(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <option value="" disabled>Selecciona...</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                        <option value="__new__">+ Nueva materia...</option>
                      </select>
                    ) : (
                      <input
                        ref={newInputRef}
                        className="pixel-input"
                        style={{ width: "100%" }}
                        placeholder="Nombre de la materia"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={confirmNewSubject}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmNewSubject();
                          if (e.key === "Escape") {
                            setAddingNew(false);
                            setNewName("");
                          }
                        }}
                      />
                    )}
                  </>
                ) : (
                  <input
                    className="pixel-input"
                    style={{ width: "100%" }}
                    placeholder="¿Qué estás estudiando?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                )}
              </div>

              {/* Duration selector */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={labelStyle}>DURACIÓN</span>
                <DurationSelector value={durationMinutes} onChange={setDuration} />
              </div>

              {/* Start button */}
              <button
                className="pixel-btn"
                style={{
                  width: "100%",
                  opacity: !subject.trim() ? 0.5 : 1,
                  cursor: !subject.trim() ? "not-allowed" : "pointer",
                }}
                disabled={!subject.trim()}
                onClick={start}
              >
                INICIAR SESIÓN
              </button>
            </>
          )}

          {(isRunning || isPaused) && (
            /* RUNNING / PAUSED right: plant + stage info */
            <>
              <div style={{ opacity: isPaused ? 0.55 : 1 }}>
                <PlantDisplay stage={growthState.currentStage} size="lg" />
              </div>

              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "var(--text-pixel-sm)",
                    color: "var(--color-text)",
                    letterSpacing: "0.05em",
                  }}
                >
                  ETAPA {growthState.currentStage} — {stageName.toUpperCase()}
                </span>
                {isPaused && (
                  <span
                    style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "var(--text-pixel-xs)",
                      color: "var(--color-heart)",
                    }}
                  >
                    EN PAUSA
                  </span>
                )}
                {growthState.isMaxStage && (
                  <span
                    style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "var(--text-pixel-xs)",
                      color: "var(--color-accent-pink)",
                    }}
                  >
                    ✦ ETAPA MÁXIMA
                  </span>
                )}
              </div>

              {!growthState.isMaxStage && (() => {
                const nextThreshold = DAISY_SPECIES.stageThresholds[growthState.currentStage];
                const elapsedMin = elapsedSeconds / 60;
                const minsLeft = Math.ceil(nextThreshold - elapsedMin);
                return (
                  <div style={{ width: "100%", maxWidth: 180, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={labelStyle}>PRÓXIMA ETAPA</span>
                    <div
                      style={{
                        width: "100%",
                        height: 12,
                        border: "3px solid var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          width: `${growthState.progressToNext * 100}%`,
                          height: "100%",
                          backgroundColor: "var(--color-accent-green)",
                          transition: "none",
                        }}
                      />
                    </div>
                    <span style={labelStyle}>~{minsLeft} MIN</span>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Bottom action bar — RUNNING / PAUSED only */}
      {showBottomBar && (
        <div
          style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            borderTop: "3px solid var(--color-border)",
            padding: "0 24px",
            backgroundColor: "var(--color-surface)",
            flexShrink: 0,
          }}
        >
          {isRunning && (
            <>
              <button className="pixel-btn-secondary" onClick={pause} style={{ flex: 1 }}>
                PAUSAR
              </button>
              <button className="pixel-btn-secondary" onClick={reset} style={{ flex: 1 }}>
                REINICIAR
              </button>
            </>
          )}
          {isPaused && (
            <>
              <button className="pixel-btn" onClick={resume} style={{ flex: 1 }}>
                REANUDAR
              </button>
              <button className="pixel-btn-secondary" onClick={reset} style={{ flex: 1 }}>
                REINICIAR
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

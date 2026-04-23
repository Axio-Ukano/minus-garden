import { useTimerStore } from "./timerStore";
import { useTimer } from "./useTimer";
import { useHistoryStore } from "../history/historyStore";

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
  const progress = secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

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
      <div className="flex items-center gap-1" style={{ color: "var(--color-hearts)" }}>
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
          {/* Background ring */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="var(--color-hearts)"
            strokeWidth="10"
            opacity="0.35"
          />
          {/* Progress ring */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke={isFinished ? "var(--color-success)" : "var(--color-accent)"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isFinished ? CIRCUMFERENCE : dashOffset}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
          />
        </svg>

        {/* Center text */}
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

      {/* Finished message */}
      {isFinished && (
        <div
          className="text-xl font-bold text-center px-6 py-3 rounded-2xl"
          style={{
            backgroundColor: "var(--color-panel)",
            color: "var(--color-accent)",
            border: "2px solid var(--color-hearts)",
          }}
        >
          ¡Lo lograste! 💗
          {Math.floor(durationMinutes / 5) > 0 && (
            <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-text-muted)" }}>
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
          className="px-4 py-2 rounded-full text-sm font-semibold outline-none w-64 text-center"
          style={{
            backgroundColor: "var(--color-panel)",
            color: "var(--color-text)",
            border: "2px solid var(--color-hearts)",
          }}
        />
      )}

      {/* Duration selector — only when idle */}
      {isIdle && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-muted)" }}>
            Duración:
          </span>
          {[5, 10, 15, 25, 50].map((min) => (
            <button
              key={min}
              onClick={() => setDuration(min)}
              className="w-10 h-10 rounded-full text-sm font-bold transition-all"
              style={{
                backgroundColor:
                  durationMinutes === min ? "var(--color-accent)" : "var(--color-panel)",
                color:
                  durationMinutes === min ? "#fff" : "var(--color-text-muted)",
                border: "2px solid var(--color-hearts)",
              }}
            >
              {min}
            </button>
          ))}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex gap-3">
        {isIdle && (
          <ActionButton onClick={start} accent>
            Iniciar
          </ActionButton>
        )}
        {isRunning && (
          <ActionButton onClick={pause}>Pausar</ActionButton>
        )}
        {isPaused && (
          <ActionButton onClick={resume} accent>
            Reanudar
          </ActionButton>
        )}
        {(isRunning || isPaused || isFinished) && (
          <ActionButton onClick={reset} muted>
            Reiniciar
          </ActionButton>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  accent,
  muted,
}: {
  children: React.ReactNode;
  onClick: () => void;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-full font-bold text-sm transition-all active:scale-95"
      style={{
        backgroundColor: accent
          ? "var(--color-accent)"
          : muted
          ? "var(--color-panel)"
          : "var(--color-panel)",
        color: accent ? "#fff" : muted ? "var(--color-text-muted)" : "var(--color-text)",
        border: `2px solid ${accent ? "var(--color-accent)" : "var(--color-hearts)"}`,
        boxShadow: accent ? "0 2px 10px rgba(255,107,181,0.35)" : "none",
      }}
    >
      {children}
    </button>
  );
}

import { useEffect, useRef, useState } from "react";

import { Toast } from "../../../components/Toast";

const DURATION_MIN = 5;
const DURATION_MAX = 300;
const DURATION_STEP = 5;

function stepDuration(v: number) {
  const snapped = Math.round(v / DURATION_STEP) * DURATION_STEP;
  return Math.max(DURATION_MIN, Math.min(DURATION_MAX, snapped));
}

export function DurationSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [inputVal, setInputVal] = useState(String(value));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputVal(String(value));
    }
  }, [value]);

  const handleClampAndToast = (rawNumber: number) => {
    if (rawNumber < DURATION_MIN) {
      setToastMessage(`El tiempo mínimo es de ${DURATION_MIN} minutos`);
      return DURATION_MIN;
    }
    if (rawNumber > DURATION_MAX) {
      setToastMessage(`El tiempo máximo es de ${DURATION_MAX} minutos`);
      return DURATION_MAX;
    }
    return rawNumber;
  };

  const commit = (raw: string) => {
    const n = parseInt(raw.trim(), 10);
    const parsed = isNaN(n) ? 0 : n;
    const clamped = handleClampAndToast(parsed);
    setInputVal(String(clamped));
    onChange(clamped);
  };

  const decrement = () => {
    const target = value - DURATION_STEP;
    const stepped = stepDuration(target);
    if (target < DURATION_MIN) handleClampAndToast(target);
    onChange(stepped);
  };

  const increment = () => {
    const target = value + DURATION_STEP;
    const stepped = stepDuration(target);
    if (target > DURATION_MAX) handleClampAndToast(target);
    onChange(stepped);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="pixel-btn-secondary"
          onClick={decrement}
          style={{
            padding: "14px 24px",
            justifyContent: "center",
            fontSize: "var(--text-pixel-md)",
          }}
        >
          -
        </button>
        <input
          ref={inputRef}
          className="pixel-input"
          style={{
            width: 88,
            textAlign: "center",
            padding: "14px 8px",
            fontSize: "var(--text-pixel-md)",
            marginLeft: 3,
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
          style={{
            padding: "14px 24px",
            justifyContent: "center",
            fontSize: "var(--text-pixel-md)",
          }}
        >
          +
        </button>
      </div>
      <span
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-sm)",
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

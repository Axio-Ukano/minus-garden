// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useRef, useState } from "react";

import { pushToast } from "@/lib/toast";
import { Input } from "@/components/Input";
import { useTranslation } from "../../../i18n";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setInputVal(String(value));
    }
  }, [value]);

  const handleClampAndToast = (rawNumber: number) => {
    if (rawNumber < DURATION_MIN) {
      pushToast(`${t.timer.min_duration} ${DURATION_MIN} ${t.timer.minutes}`);
      return DURATION_MIN;
    }
    if (rawNumber > DURATION_MAX) {
      pushToast(`${t.timer.max_duration} ${DURATION_MAX} ${t.timer.minutes}`);
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
        <Input
          ref={inputRef}
          data-testid="duration-input"
          style={{
            width: 88,
            textAlign: "center",
            padding: "14px 8px",
            fontSize: "var(--text-pixel-md)",
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
        {t.timer.minutes_label}
      </span>
    </div>
  );
}

// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useState, useRef, useCallback } from "react";
import "./PixelSlider.css";

interface PixelSliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: number | string;
  formatLabel?: (v: number) => string;
}

export function PixelSlider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  width,
  formatLabel = (v) => `${Math.round(v * 100)}%`,
}: PixelSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipLeft, setTooltipLeft] = useState<number>(0);
  const trackRef = useRef<HTMLInputElement>(null);

  const updateTooltipPosition = useCallback(
    (input: HTMLInputElement) => {
      const pct = (Number(input.value) - min) / (max - min);
      const thumbSize = 16;
      const trackWidth = input.offsetWidth;
      const px = pct * (trackWidth - thumbSize) + thumbSize / 2;
      setTooltipLeft(px);
    },
    [min, max]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
    updateTooltipPosition(e.target);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    setIsDragging(true);
    updateTooltipPosition(e.currentTarget);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="pixel-slider-wrap" style={width !== undefined ? { width } : undefined}>
      {isDragging && (
        <div className="pixel-slider-tooltip" style={{ left: tooltipLeft }}>
          {formatLabel(value)}
        </div>
      )}
      <input
        ref={trackRef}
        type="range"
        className="pixel-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}

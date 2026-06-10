// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { PixelSlider } from "@/components/PixelSlider";

export function VolumeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="volume-slider-row">
      <span className="volume-slider-row__label">{label}</span>
      <PixelSlider value={value} onChange={onChange} />
      <span className="volume-slider-row__value">{Math.round(value * 100)}%</span>
    </div>
  );
}

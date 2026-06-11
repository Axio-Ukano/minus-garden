// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { Tooltip } from "./Tooltip";
import { useTranslation } from "@/i18n";
import "./Button.css";

export function PixelArrowButton({
  direction,
  onClick,
  disabled = false,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const arrow = direction === "left" ? "\u2039" : "\u203a";
  const label = direction === "left" ? t.common.prev : t.common.next;

  return (
    <Tooltip text={label} position="top">
      <button
        className="pixel-btn-icon"
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: "6px 12px",
          fontSize: "var(--text-pixel-lg)",
        }}
      >
        {arrow}
      </button>
    </Tooltip>
  );
}

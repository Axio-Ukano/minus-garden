// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { Tooltip } from "./Tooltip";
import { useTranslation } from "@/i18n";
import "./Button.css";

export function PixelCloseButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();

  return (
    <Tooltip text={t.common.close} position="bottom">
      <button
        className="pixel-btn-icon"
        onClick={onClick}
        style={{
          padding: "6px 10px",
          fontSize: "var(--text-pixel-md)",
        }}
      >
        X
      </button>
    </Tooltip>
  );
}

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

  return (
    <Tooltip text={direction === "left" ? t.common.prev : t.common.next} position="top">
      <button
        className="pixel-btn-icon"
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

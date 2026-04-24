import { Tooltip } from "./Tooltip";
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
  const arrow = direction === "left" ? "\u2039" : "\u203a";

  return (
    <Tooltip text={direction === "left" ? "Anterior" : "Siguiente"} position="top">
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

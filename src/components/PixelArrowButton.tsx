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
    <button
      className="pixel-btn-icon"
      onClick={onClick}
      disabled={disabled}
      title={direction === "left" ? "Anterior" : "Siguiente"}
      style={{
        padding: "6px 12px",
        fontSize: "var(--text-pixel-lg)",
      }}
    >
      {arrow}
    </button>
  );
}

import { Tooltip } from "./Tooltip";
import "./Button.css";

export function PixelCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip text="Cerrar" position="bottom">
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

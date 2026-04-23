import "./Button.css";

export function PixelCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="pixel-btn-icon"
      onClick={onClick}
      title="Cerrar"
      style={{
        padding: "6px 10px",
        fontSize: "var(--text-pixel-md)",
      }}
    >
      X
    </button>
  );
}

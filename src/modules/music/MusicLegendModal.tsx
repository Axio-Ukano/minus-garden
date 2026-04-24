import { useEffect } from "react";
import { PixelCloseButton } from "../../components/PixelCloseButton";
import "./MusicLegendModal.css";

const LEGEND_ROWS = [
  {
    glyph: "◄◄",
    name: "ANTERIOR",
    desc: "Vuelve al inicio de la canción. Si llevas menos de 3s, va a la anterior.",
  },
  { glyph: "▶ / ❙❙", name: "REPRODUCIR / PAUSAR", desc: "Inicia o pausa la reproducción." },
  { glyph: "►►", name: "SIGUIENTE", desc: "Avanza a la siguiente canción en la lista." },
  { glyph: "⇌", name: "MEZCLA", desc: "Reproduce canciones en orden aleatorio." },
  { glyph: "⟳", name: "REPETIR", desc: "Cicla entre: Sin repetir → Repetir todo → Repetir una." },
];

export function MusicLegendModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(30, 15, 20, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--color-panel)",
          border: "3px solid var(--color-border)",
          boxShadow: "6px 6px 0 var(--color-pixel-shadow)",
          maxWidth: 560,
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "3px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-lg)",
              color: "var(--color-accent-purple)",
              letterSpacing: "0.1em",
            }}
          >
            CONTROLES
          </span>
          <PixelCloseButton onClick={onClose} />
        </div>

        {/* Table */}
        <div style={{ padding: "16px 20px", overflowY: "auto" }}>
          <table className="music-legend-table">
            <thead>
              <tr>
                <th>BOTÓN</th>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {LEGEND_ROWS.map((row) => (
                <tr key={row.name}>
                  <td className="music-legend-glyph">{row.glyph}</td>
                  <td className="music-legend-name">{row.name}</td>
                  <td className="music-legend-desc">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "3px solid var(--color-border)",
            flexShrink: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-xs)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            Presiona ESC o haz clic fuera para cerrar
          </span>
        </div>
      </div>
    </div>
  );
}

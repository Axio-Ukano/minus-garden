import { useEffect, useState } from "react";
import { PixelCloseButton } from "../../components/PixelCloseButton";
import { InfoTooltip } from "../../components/InfoTooltip";
import { PixelSlider } from "../../components/PixelSlider";
import { useSettingsStore } from "./settingsStore";
import { useAudioStore } from "../audio/audioStore";
import { AMBIENT_TRACKS } from "../audio/audioRegistry";
import type { ClickSfxId, TypingSfxId } from "../audio/audioService";
import "./SettingsModal.css";

// ─── Section types ────────────────────────────────────────────────────────────
type Section = "sound" | "interface" | "timer" | "general" | "shortcuts";

const NAV_ITEMS: { id: Section; label: string; emoji: string }[] = [
  { id: "sound", label: "SONIDO", emoji: "♪" },
  { id: "interface", label: "INTERFAZ", emoji: "◈" },
  { id: "timer", label: "POMODORO", emoji: "⏱" },
  { id: "general", label: "GENERAL", emoji: "⚙" },
  { id: "shortcuts", label: "ATAJOS", emoji: "⌨" },
];

// ─── Volume slider ─────────────────────────────────────────────────────────────
function VolumeSlider({
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

// ─── Ambient selector ─────────────────────────────────────────────────────────
function AmbientSelector() {
  const { activeAmbient, setAmbient } = useAudioStore();

  return (
    <div>
      <hr className="settings-sep" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          SONIDO AMBIENTE
        </span>
        <InfoTooltip
          text="Reproduce un sonido de fondo en bucle mientras estudias."
          align="start"
        />
      </div>
      <div className="ambient-grid">
        {AMBIENT_TRACKS.map((track, i) => (
          <button
            key={track.id}
            data-no-sfx
            className={`ambient-btn ${activeAmbient === track.id ? "active" : ""}`}
            onClick={() => setAmbient(activeAmbient === track.id ? null : track.id)}
          >
            <span className="ambient-btn__emoji">{track.emoji}</span>
            {track.label}
            <span className="ambient-btn__tooltip">
              <InfoTooltip
                text={track.description}
                position="bottom"
                align={i % 3 === 2 ? "end" : "center"}
              />
            </span>
          </button>
        ))}
        <button
          data-no-sfx
          className={`ambient-btn ${activeAmbient === null ? "active" : ""}`}
          onClick={() => setAmbient(null)}
        >
          <span className="ambient-btn__emoji">✕</span>
          APAGAR
        </button>
      </div>
    </div>
  );
}

// ─── Ambient randomizer ───────────────────────────────────────────────────────
function AmbientRandomizer() {
  const {
    ambientRandomize,
    ambientRandomizeMinutes,
    ambientRandomizePool,
    setAmbientRandomize,
    setAmbientRandomizeMinutes,
    setAmbientRandomizePool,
  } = useSettingsStore();

  const togglePool = (id: string) => {
    const pool = ambientRandomizePool as string[];
    const next = pool.includes(id) ? pool.filter((x) => x !== id) : [...pool, id];
    setAmbientRandomizePool(next as typeof ambientRandomizePool);
  };

  return (
    <div>
      <hr className="settings-sep" />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <button
          data-no-sfx
          className={ambientRandomize ? "pixel-btn" : "pixel-btn-secondary"}
          style={{ fontSize: "var(--text-pixel-xs)", padding: "6px 10px" }}
          onClick={() => setAmbientRandomize(!ambientRandomize)}
        >
          {ambientRandomize ? "✓" : "○"} ALEATORIZAR
        </button>
        <InfoTooltip
          text={"Cambia automáticamente el sonido\nde ambiente cada N minutos."}
          align="start"
        />
      </div>

      {ambientRandomize && (
        <div style={{ paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className="settings-sub-label" style={{ marginBottom: 0 }}>
              CADA
            </span>
            <button
              className="pixel-btn-secondary"
              style={{
                width: 28,
                height: 28,
                padding: 0,
                justifyContent: "center",
                fontSize: "var(--text-pixel-sm)",
              }}
              onClick={() => setAmbientRandomizeMinutes(Math.max(1, ambientRandomizeMinutes - 1))}
            >
              −
            </button>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xs)",
                color: "var(--color-text)",
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {ambientRandomizeMinutes}
            </span>
            <button
              className="pixel-btn-secondary"
              style={{
                width: 28,
                height: 28,
                padding: 0,
                justifyContent: "center",
                fontSize: "var(--text-pixel-sm)",
              }}
              onClick={() => setAmbientRandomizeMinutes(Math.min(60, ambientRandomizeMinutes + 1))}
            >
              +
            </button>
            <span className="settings-sub-label" style={{ marginBottom: 0 }}>
              MIN
            </span>
          </div>

          <div className="ambient-grid" style={{ marginTop: 0 }}>
            {AMBIENT_TRACKS.map((track) => {
              const inPool = (ambientRandomizePool as string[]).includes(track.id);
              return (
                <button
                  key={track.id}
                  data-no-sfx
                  className={`ambient-btn ${inPool ? "active" : ""}`}
                  onClick={() => togglePool(track.id)}
                >
                  {inPool && (
                    <span
                      style={{
                        position: "absolute",
                        top: 4,
                        left: 6,
                        fontFamily: "var(--font-pixel)",
                        fontSize: "var(--text-pixel-xs)",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  <span className="ambient-btn__emoji">{track.emoji}</span>
                  {track.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Custom SFX pickers ───────────────────────────────────────────────────────
const CLICK_OPTIONS: { id: ClickSfxId; label: string }[] = [
  { id: "button_click", label: "NORMAL" },
  { id: "button_click_soft", label: "SUAVE" },
  { id: "button_click_hard", label: "DURO" },
  { id: "button_click_pop", label: "POP" },
  { id: "none", label: "NINGUNO" },
];

const TYPING_OPTIONS: { id: TypingSfxId; label: string }[] = [
  { id: "type_soft", label: "SUAVE" },
  { id: "type_tick", label: "TICK" },
  { id: "type_mechanical", label: "MECÁNICO" },
  { id: "none", label: "NINGUNO" },
];

function CustomSfxPickers() {
  const { clickSfxId, typingSfxId, setClickSfxId, setTypingSfxId } = useSettingsStore();

  return (
    <div>
      <hr className="settings-sep" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          SONIDO DE CLICK
        </span>
        <InfoTooltip text="Sonido que se reproduce al hacer clic en botones." align="start" />
      </div>
      <div className="sfx-picker-row">
        {CLICK_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={clickSfxId === opt.id ? "pixel-btn" : "pixel-btn-secondary"}
            style={{ fontSize: "var(--text-pixel-xs)", padding: "5px 8px" }}
            onClick={() => setClickSfxId(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <hr className="settings-sep" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          SONIDO DE TECLADO
        </span>
        <InfoTooltip text="Sonido al escribir en campos de texto." align="start" />
      </div>
      <div className="sfx-picker-row">
        {TYPING_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={typingSfxId === opt.id ? "pixel-btn" : "pixel-btn-secondary"}
            style={{ fontSize: "var(--text-pixel-xs)", padding: "5px 8px" }}
            onClick={() => setTypingSfxId(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sound section ────────────────────────────────────────────────────────────
function SoundSection() {
  const {
    masterVolume,
    sfxVolume,
    ambientVolume,
    musicVolume,
    setMasterVolume,
    setSfxVolume,
    setAmbientVolume,
    setMusicVolume,
  } = useSettingsStore();

  return (
    <div>
      <div className="settings-section__title">SONIDO</div>
      <VolumeSlider label="MASTER" value={masterVolume} onChange={setMasterVolume} />
      <VolumeSlider label="EFECTOS" value={sfxVolume} onChange={setSfxVolume} />
      <VolumeSlider label="AMBIENTE" value={ambientVolume} onChange={setAmbientVolume} />
      <VolumeSlider label="MÚSICA" value={musicVolume} onChange={setMusicVolume} />
      <AmbientSelector />
      <AmbientRandomizer />
      <CustomSfxPickers />
    </div>
  );
}

// ─── Interface section ────────────────────────────────────────────────────────
function InterfaceSection() {
  const { theme, setTheme, plantSide, setPlantSide } = useSettingsStore();

  return (
    <div>
      <div className="settings-section__title">INTERFAZ</div>

      {/* Theme */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          TEMA
        </span>
        <InfoTooltip text="Cambia entre modo claro y oscuro." align="start" />
      </div>
      <div className="theme-toggle-row">
        <button
          className={theme === "light" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setTheme("light")}
        >
          ☀ CLARO
        </button>
        <button
          className={theme === "dark" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setTheme("dark")}
        >
          ☽ OSCURO
        </button>
      </div>

      <hr className="settings-sep" />

      {/* Plant side */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          LADO DE LA PLANTA
        </span>
        <InfoTooltip
          text="Coloca la planta a la izquierda o derecha del temporizador."
          align="start"
        />
      </div>
      <div className="layout-option-row">
        <button
          className={plantSide === "left" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setPlantSide("left")}
        >
          ◄ IZQUIERDA
        </button>
        <button
          className={plantSide === "right" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setPlantSide("right")}
        >
          DERECHA ►
        </button>
      </div>
    </div>
  );
}

// ─── WIP section ──────────────────────────────────────────────────────────────
function WipSection({ title }: { title: string }) {
  return (
    <div>
      <div className="settings-section__title">{title}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          gap: 16,
          color: "var(--color-text-muted)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.5 }}>🚧</div>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-sm)",
            letterSpacing: "0.05em",
          }}
        >
          EN CONSTRUCCIÓN
        </div>
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          Estamos trabajando para traer estos ajustes muy pronto.
        </p>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lastSettingsSection, setLastSettingsSection } = useSettingsStore();
  const [activeSection, setActiveSection] = useState<Section>(lastSettingsSection);

  const handleSetSection = (s: Section) => {
    setActiveSection(s);
    setLastSettingsSection(s);
  };

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
        zIndex: 200,
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
          width: "100%",
          maxWidth: 620,
          height: "540px",
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
            AJUSTES
          </span>
          <PixelCloseButton onClick={onClose} />
        </div>

        {/* Body */}
        <div className="settings-modal__body">
          {/* Sidebar */}
          <nav className="settings-modal__sidebar">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`settings-nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => handleSetSection(item.id)}
              >
                <span style={{ fontSize: 14 }}>{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-modal__content">
            {activeSection === "sound" && <SoundSection />}
            {activeSection === "interface" && <InterfaceSection />}
            {activeSection === "timer" && <WipSection title="AJUSTES POMODORO" />}
            {activeSection === "general" && <WipSection title="GENERALES" />}
            {activeSection === "shortcuts" && <WipSection title="ATAJOS DE TECLADO" />}
          </div>
        </div>
      </div>
    </div>
  );
}

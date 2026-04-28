import { InfoTooltip } from "@/components/InfoTooltip";
import { useTranslation } from "@/i18n";
import { useSettingsStore } from "../settingsStore";

export function InterfaceSection() {
  const { theme, setTheme, plantSide, setPlantSide, language, setLanguage } = useSettingsStore();
  const { t } = useTranslation();

  return (
    <div>
      <div className="settings-section__title">{t.settings.interface.title}</div>

      {/* Theme */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          {t.settings.interface.theme}
        </span>
        <InfoTooltip text={t.settings.interface.theme_tooltip} align="start" />
      </div>
      <div className="theme-toggle-row">
        <button
          className={theme === "light" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setTheme("light")}
        >
          {t.settings.interface.theme_light}
        </button>
        <button
          className={theme === "dark" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setTheme("dark")}
        >
          {t.settings.interface.theme_dark}
        </button>
      </div>

      <hr className="settings-sep" />

      {/* Plant side */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          {t.settings.interface.plant_side}
        </span>
        <InfoTooltip text={t.settings.interface.plant_side_tooltip} align="start" />
      </div>
      <div className="layout-option-row">
        <button
          className={plantSide === "left" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setPlantSide("left")}
        >
          {t.settings.interface.plant_left}
        </button>
        <button
          className={plantSide === "right" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setPlantSide("right")}
        >
          {t.settings.interface.plant_right}
        </button>
      </div>

      <hr className="settings-sep" />

      {/* Language */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          {t.settings.interface.language}
        </span>
        <InfoTooltip text={t.settings.interface.language_tooltip} align="start" />
      </div>
      <div className="layout-option-row">
        <button
          className={language === "en" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setLanguage("en")}
        >
          {t.settings.interface.language_en}
        </button>
        <button
          className={language === "es" ? "pixel-btn" : "pixel-btn-secondary"}
          onClick={() => setLanguage("es")}
        >
          {t.settings.interface.language_es}
        </button>
      </div>
    </div>
  );
}

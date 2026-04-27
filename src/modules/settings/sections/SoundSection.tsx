import { InfoTooltip } from "@/components/InfoTooltip";
import { useSettingsStore } from "@/modules/settings/settingsStore";
import { useAudioStore } from "@/modules/audio/audioStore";
import { AMBIENT_TRACKS } from "@/modules/audio/audioRegistry";
import type { ClickSfxId, TypingSfxId } from "@/modules/audio/audioService";
import { useTranslation } from "@/i18n";
import { VolumeSlider } from "@/modules/settings/components/VolumeSlider";

function AmbientSelector() {
  const { activeAmbient, setAmbient } = useAudioStore();
  const { t } = useTranslation();

  return (
    <div>
      <hr className="settings-sep" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          {t.settings.sound.ambient_label}
        </span>
        <InfoTooltip text={t.settings.sound.ambient_tooltip} align="start" />
      </div>
      <div className="ambient-grid">
        {AMBIENT_TRACKS.map((track, i) => {
          const labelKey = `${track.id}_label` as keyof typeof t.audio;
          const descKey = `${track.id}_desc` as keyof typeof t.audio;
          return (
            <button
              key={track.id}
              data-no-sfx
              className={`ambient-btn ${activeAmbient === track.id ? "active" : ""}`}
              onClick={() => setAmbient(activeAmbient === track.id ? null : track.id)}
            >
              <span className="ambient-btn__emoji">{track.emoji}</span>
              {t.audio[labelKey]}
              <span className="ambient-btn__tooltip">
                <InfoTooltip
                  text={t.audio[descKey]}
                  position="bottom"
                  align={i % 3 === 2 ? "end" : "center"}
                />
              </span>
            </button>
          );
        })}
        <button
          data-no-sfx
          className={`ambient-btn ${activeAmbient === null ? "active" : ""}`}
          onClick={() => setAmbient(null)}
        >
          <span className="ambient-btn__emoji">✕</span>
          {t.settings.sound.ambient_off}
        </button>
      </div>
    </div>
  );
}

function AmbientRandomizer() {
  const {
    ambientRandomize,
    ambientRandomizeMinutes,
    ambientRandomizePool,
    setAmbientRandomize,
    setAmbientRandomizeMinutes,
    setAmbientRandomizePool,
  } = useSettingsStore();
  const { t } = useTranslation();

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
          {ambientRandomize ? "✓" : "○"} {t.settings.sound.randomize}
        </button>
        <InfoTooltip text={t.settings.sound.randomize_tooltip} align="start" />
      </div>

      {ambientRandomize && (
        <div style={{ paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className="settings-sub-label" style={{ marginBottom: 0 }}>
              {t.settings.sound.every}
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
              {t.settings.sound.min_abbr}
            </span>
          </div>

          <div className="ambient-grid" style={{ marginTop: 0 }}>
            {AMBIENT_TRACKS.map((track) => {
              const inPool = (ambientRandomizePool as string[]).includes(track.id);
              const labelKey = `${track.id}_label` as keyof typeof t.audio;
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
                  {t.audio[labelKey]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSfxPickers() {
  const { clickSfxId, typingSfxId, setClickSfxId, setTypingSfxId } = useSettingsStore();
  const { t } = useTranslation();

  const CLICK_OPTIONS: { id: ClickSfxId; label: string }[] = [
    { id: "button_click", label: t.settings.sound.click_normal },
    { id: "button_click_soft", label: t.settings.sound.click_soft },
    { id: "button_click_hard", label: t.settings.sound.click_hard },
    { id: "button_click_pop", label: t.settings.sound.click_pop },
    { id: "none", label: t.settings.sound.click_none },
  ];

  const TYPING_OPTIONS: { id: TypingSfxId; label: string }[] = [
    { id: "type_soft", label: t.settings.sound.type_soft },
    { id: "type_tick", label: t.settings.sound.type_tick },
    { id: "type_mechanical", label: t.settings.sound.type_mechanical },
    { id: "none", label: t.settings.sound.type_none },
  ];

  return (
    <div>
      <hr className="settings-sep" />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span className="settings-sub-label" style={{ marginBottom: 0 }}>
          {t.settings.sound.click_sound}
        </span>
        <InfoTooltip text={t.settings.sound.click_tooltip} align="start" />
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
          {t.settings.sound.keyboard_sound}
        </span>
        <InfoTooltip text={t.settings.sound.keyboard_tooltip} align="start" />
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

export function SoundSection() {
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
  const { t } = useTranslation();

  return (
    <div>
      <div className="settings-section__title">{t.settings.sound.title}</div>
      <VolumeSlider
        label={t.settings.sound.master}
        value={masterVolume}
        onChange={setMasterVolume}
      />
      <VolumeSlider label={t.settings.sound.effects} value={sfxVolume} onChange={setSfxVolume} />
      <VolumeSlider
        label={t.settings.sound.ambient}
        value={ambientVolume}
        onChange={setAmbientVolume}
      />
      <VolumeSlider label={t.settings.sound.music} value={musicVolume} onChange={setMusicVolume} />
      <AmbientSelector />
      <AmbientRandomizer />
      <CustomSfxPickers />
    </div>
  );
}

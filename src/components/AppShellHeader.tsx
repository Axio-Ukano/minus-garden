import { useState } from "react";
import { HeartIcon } from "./HeartIcon";
import {
  GearIcon,
  SpeakerIcon,
  SpeakerMutedIcon,
  CloudIcon,
  MusicNoteIcon,
  BellIcon,
} from "./PixelIcons";
import { useHistoryStore } from "../modules/history/historyStore";
import { useSettingsStore } from "../modules/settings/settingsStore";
import { Tooltip } from "./Tooltip";
import { useTranslation } from "../i18n";

export function AppShellHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  const totalHearts = useHistoryStore((s) => s.totalHearts);
  const {
    masterMuted,
    setMasterMuted,
    ambientMuted,
    setAmbientMuted,
    musicMuted,
    setMusicMuted,
    sfxMuted,
    setSfxMuted,
  } = useSettingsStore();
  const { t } = useTranslation();

  const [isAudioMenuExpanded, setIsAudioMenuExpanded] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "24px 32px 8px",
        flexShrink: 0,
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Settings & Quick Audio Toggles */}
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <Tooltip text={t.header.settings_tooltip} position="bottom" align="start">
          <button
            data-no-sfx
            className="pixel-btn-icon"
            onClick={onOpenSettings}
            style={{ width: 36, height: 36 }}
            aria-label={t.header.settings_aria}
          >
            <GearIcon size={16} />
          </button>
        </Tooltip>

        <div
          style={{
            width: "2px",
            height: "24px",
            background: "var(--color-border)",
            margin: "0 12px",
          }}
        />

        {/*
          overflow:visible so box-shadows and tooltip bubbles are NOT clipped.
          We use max-width for layout space + opacity/pointer-events for visibility.
          Opacity fades first on collapse, appears last on expand, so there's
          no visual bleed of buttons outside the container during transition.
        */}
        <div
          style={{
            maxWidth: isAudioMenuExpanded ? "300px" : "0px",
            overflow: "visible",
            transition: "max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginRight: "8px",
              opacity: isAudioMenuExpanded ? 1 : 0,
              pointerEvents: isAudioMenuExpanded ? "auto" : "none",
              transition: isAudioMenuExpanded
                ? "opacity 0.2s ease 0.2s" // expand: wait for space, then fade in
                : "opacity 0.15s ease", // collapse: fade out first
              whiteSpace: "nowrap",
            }}
          >
            <Tooltip
              text={masterMuted ? t.header.unmute_master : t.header.mute_master}
              position="bottom"
            >
              <button
                data-no-sfx
                className="pixel-btn-icon"
                onClick={() => setMasterMuted(!masterMuted)}
                style={{ width: 36, height: 36, opacity: masterMuted ? 0.5 : 1, flexShrink: 0 }}
              >
                {masterMuted ? <SpeakerMutedIcon size={16} /> : <SpeakerIcon size={16} />}
              </button>
            </Tooltip>

            <Tooltip
              text={ambientMuted ? t.header.unmute_ambient : t.header.mute_ambient}
              position="bottom"
            >
              <button
                data-no-sfx
                className="pixel-btn-icon"
                onClick={() => setAmbientMuted(!ambientMuted)}
                style={{ width: 36, height: 36, opacity: ambientMuted ? 0.5 : 1, flexShrink: 0 }}
              >
                <CloudIcon size={16} />
              </button>
            </Tooltip>

            <Tooltip
              text={musicMuted ? t.header.unmute_music : t.header.mute_music}
              position="bottom"
            >
              <button
                data-no-sfx
                className="pixel-btn-icon"
                onClick={() => setMusicMuted(!musicMuted)}
                style={{ width: 36, height: 36, opacity: musicMuted ? 0.5 : 1, flexShrink: 0 }}
              >
                <MusicNoteIcon size={16} />
              </button>
            </Tooltip>

            <Tooltip text={sfxMuted ? t.header.unmute_sfx : t.header.mute_sfx} position="bottom">
              <button
                data-no-sfx
                className="pixel-btn-icon"
                onClick={() => setSfxMuted(!sfxMuted)}
                style={{ width: 36, height: 36, opacity: sfxMuted ? 0.5 : 1, flexShrink: 0 }}
              >
                <BellIcon size={16} />
              </button>
            </Tooltip>
          </div>
        </div>

        <Tooltip
          text={isAudioMenuExpanded ? t.header.hide_audio : t.header.show_audio}
          position="bottom"
          align="start"
        >
          <button
            data-no-sfx
            className="pixel-btn-icon"
            onClick={() => setIsAudioMenuExpanded(!isAudioMenuExpanded)}
            style={{ width: 36, height: 36, flexShrink: 0, fontSize: "var(--text-pixel-lg)" }}
            aria-label={isAudioMenuExpanded ? t.header.hide_audio : t.header.show_audio}
          >
            {isAudioMenuExpanded ? "‹" : "›"}
          </button>
        </Tooltip>
      </div>

      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
        <HeartIcon size={20} color="var(--color-accent-purple)" />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-2xl)",
            color: "var(--color-accent-purple)",
            letterSpacing: "0.1em",
            paddingTop: 4,
          }}
        >
          MINU&apos;S GARDEN
        </span>
        <HeartIcon size={20} color="var(--color-accent-purple)" />
      </div>

      {/* Hearts counter */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-md)",
            color: "var(--color-heart)",
            opacity: totalHearts === 0 ? 0.3 : 1,
          }}
        >
          <HeartIcon size={16} color="var(--color-heart)" />
          <span style={{ paddingTop: 2 }}>× {totalHearts}</span>
        </div>
      </div>
    </div>
  );
}

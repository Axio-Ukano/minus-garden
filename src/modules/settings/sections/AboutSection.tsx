// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useTranslation } from "@/i18n";

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="settings-section__title">{t.settings.about.title}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 20px",
          gap: 10,
          color: "var(--color-text-muted)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.6, lineHeight: 1 }}>🌱</div>

        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-md)",
            color: "var(--color-accent-purple)",
            letterSpacing: "0.1em",
          }}
        >
          Minu&apos;s Garden
        </div>

        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            letterSpacing: "0.06em",
          }}
        >
          v{__APP_VERSION__}
        </div>

        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            lineHeight: 1.6,
            maxWidth: 280,
            margin: 0,
          }}
        >
          {t.settings.about.tagline}
        </p>

        <hr className="settings-sep" style={{ width: "60%", margin: "12px 0" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
          }}
        >
          <span>{t.settings.about.by}</span>
          <span>© 2024–2026 · {t.settings.about.license}</span>
          <span style={{ opacity: 0.8 }}>{t.settings.about.rights}</span>
        </div>
      </div>
    </div>
  );
}

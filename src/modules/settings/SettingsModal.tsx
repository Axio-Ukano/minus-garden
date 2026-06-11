// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useState } from "react";
import { PixelCloseButton } from "@/components/PixelCloseButton";
import { useTranslation } from "@/i18n";
import { useSettingsStore, type Section } from "./settingsStore";
import { SoundSection } from "./sections/SoundSection";
import { InterfaceSection } from "./sections/InterfaceSection";
import { WipSection } from "./sections/WipSection";
import { AboutSection } from "./sections/AboutSection";
import "./SettingsModal.css";

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lastSettingsSection, setLastSettingsSection } = useSettingsStore();
  const [activeSection, setActiveSection] = useState<Section>(lastSettingsSection);
  const { t } = useTranslation();

  const NAV_ITEMS: { id: Section; label: string; emoji: string; wip?: true }[] = [
    { id: "general", label: t.settings.nav.general, emoji: "⚙" },
    { id: "sound", label: t.settings.nav.sound, emoji: "♪" },
    { id: "interface", label: t.settings.nav.interface, emoji: "◈" },
    { id: "timer", label: t.settings.nav.timer, emoji: "⏱", wip: true },
    { id: "shortcuts", label: t.settings.nav.shortcuts, emoji: "⌨", wip: true },
    { id: "about", label: t.settings.nav.about, emoji: "❀" },
  ];

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
            {t.settings.title}
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
                className={`settings-nav-item ${item.wip ? "settings-nav-item--wip" : ""} ${activeSection === item.id ? "active" : ""}`}
                onClick={() => handleSetSection(item.id)}
              >
                <span style={{ fontSize: 13, flexShrink: 0 }}>{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-modal__content">
            {activeSection === "sound" && <SoundSection />}
            {activeSection === "interface" && <InterfaceSection />}
            {activeSection === "timer" && <WipSection title={t.settings.wip.timer_title} />}
            {activeSection === "general" && <WipSection title={t.settings.wip.general_title} />}
            {activeSection === "shortcuts" && <WipSection title={t.settings.wip.shortcuts_title} />}
            {activeSection === "about" && <AboutSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

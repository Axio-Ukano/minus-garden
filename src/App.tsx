import { useState, useEffect } from "react";
import { TimerDisplay } from "@/modules/timer";
import { HistoryView, useHistoryStore } from "@/modules/history";
import { MusicPlayerView, MiniPlayer } from "@/modules/music";
import { useSubjectStore } from "@/modules/subjects";
import { SettingsModal } from "@/modules/settings";
import { useAudio, useAudioStore } from "@/modules/audio";
import { AppShellHeader } from "@/components/AppShellHeader";
import { ChevronIcon } from "@/components/PixelIcons";
import { Tooltip } from "@/components/Tooltip";
import { ToastContainer } from "@/lib/toast";
import { useTranslation } from "@/i18n";
import SenaDemo from "@/features/sena/SenaDemo";

type Tab = "timer" | "history" | "music" | "sena";

function ClockIcon({ bg }: { bg: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="14" height="14" fill="currentColor" />
      <rect x="2" y="2" width="12" height="12" fill={bg} />
      <rect x="7" y="4" width="2" height="5" fill="currentColor" />
      <rect x="7" y="8" width="4" height="2" fill="currentColor" />
    </svg>
  );
}

function BookIcon({ bg }: { bg: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1" width="12" height="14" fill="currentColor" />
      <rect x="3" y="2" width="10" height="12" fill={bg} />
      <rect x="4" y="4" width="8" height="2" fill="currentColor" />
      <rect x="4" y="7" width="8" height="2" fill="currentColor" />
      <rect x="4" y="10" width="5" height="2" fill="currentColor" />
    </svg>
  );
}

function MusicIcon({ bg }: { bg: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="1" width="2" height="9" fill="currentColor" />
      <rect x="10" y="1" width="4" height="2" fill="currentColor" />
      <rect x="5" y="8" width="5" height="4" fill="currentColor" />
      <rect x="4" y="9" width="7" height="2" fill={bg} />
      <rect x="5" y="9" width="5" height="2" fill="currentColor" />
    </svg>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMiniCollapsed, setIsMiniCollapsed] = useState(false);
  const { t } = useTranslation();
  useAudio();

  const currentTrackIndex = useAudioStore((s) => s.currentTrackIndex);
  const showMiniPlayer = currentTrackIndex !== null && activeTab !== "music";

  const NAV_TABS: { id: Tab; label: string }[] = [
    { id: "timer", label: t.nav.study },
    { id: "history", label: t.nav.history },
    { id: "music", label: t.nav.music },
    { id: "sena", label: "SENA" },
  ];

  useEffect(() => {
    void useHistoryStore.getState().loadSessions();
    void useHistoryStore.getState().loadUserState();
    void useSubjectStore.getState().loadSubjects();
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <AppShellHeader onOpenSettings={() => setIsSettingsOpen(true)} />
      <ToastContainer />

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
        {activeTab === "timer" && (
          <TimerDisplay onNavigateToHistory={() => setActiveTab("history")} />
        )}
        {activeTab === "history" && <HistoryView />}
        {activeTab === "music" && <MusicPlayerView />}
        {activeTab === "sena" && <SenaDemo />}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Bottom dock — two independent collapse toggles */}
      <div className="bottom-dock">
        {/* Toggle 1: collapse nav bar */}
        <Tooltip
          text={isNavCollapsed ? t.nav_tooltip.show_nav : t.nav_tooltip.hide_nav}
          position="top"
          align="start"
          wrapStyle={{
            position: "absolute",
            top: -26,
            left: 12,
            width: 36,
            height: 26,
            zIndex: 11,
          }}
        >
          <button
            className={`bottom-dock__toggle${isNavCollapsed ? " bottom-dock__toggle--closed" : ""}`}
            onClick={() => setIsNavCollapsed((v) => !v)}
            aria-label={isNavCollapsed ? t.nav_tooltip.show_nav_aria : t.nav_tooltip.hide_nav_aria}
            data-no-sfx
          >
            <ChevronIcon size={12} direction={isNavCollapsed ? "up" : "down"} />
          </button>
        </Tooltip>

        {/* Toggle 2: collapse mini player — only when mini player is present */}
        {showMiniPlayer && (
          <Tooltip
            text={isMiniCollapsed ? t.nav_tooltip.show_player : t.nav_tooltip.hide_player}
            position="top"
            align="start"
            wrapStyle={{
              position: "absolute",
              top: -20,
              left: 52,
              width: 26,
              height: 20,
              zIndex: 11,
            }}
          >
            <button
              className={`bottom-dock__toggle bottom-dock__toggle--mini${isMiniCollapsed ? " bottom-dock__toggle--closed" : ""}`}
              onClick={() => setIsMiniCollapsed((v) => !v)}
              aria-label={
                isMiniCollapsed ? t.nav_tooltip.show_player_aria : t.nav_tooltip.hide_player_aria
              }
              data-no-sfx
            >
              <ChevronIcon size={9} direction={isMiniCollapsed ? "up" : "down"} />
            </button>
          </Tooltip>
        )}

        {/* Mini player — collapses independently */}
        {showMiniPlayer && (
          <div
            className={`bottom-dock__miniplayer${isMiniCollapsed ? " bottom-dock__miniplayer--collapsed" : ""}`}
          >
            <div className="bottom-dock__miniplayer-inner">
              <MiniPlayer onNavigateToMusic={() => setActiveTab("music")} />
            </div>
          </div>
        )}

        {/* Nav — collapses independently */}
        <div className={`bottom-dock__content${isNavCollapsed ? " bottom-dock--collapsed" : ""}`}>
          <div className="bottom-dock__content-inner">
            <nav
              style={{
                display: "flex",
                background: "var(--color-surface)",
                borderTop: "3px solid var(--color-border)",
                boxShadow: "0 -3px 0 var(--color-pixel-shadow)",
                position: "relative",
                zIndex: 10,
              }}
            >
              {NAV_TABS.map((tab, idx) => {
                const active = activeTab === tab.id;
                const isLast = idx === NAV_TABS.length - 1;
                return (
                  <button
                    key={tab.id}
                    className={`pixel-nav-btn ${active ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (isNavCollapsed) setIsNavCollapsed(false);
                    }}
                    style={{
                      flex: 1,
                      color: active ? "#fff" : "var(--color-text-muted)",
                      borderRight: !isLast ? "3px solid var(--color-border)" : "none",
                    }}
                  >
                    {tab.id === "timer" && (
                      <ClockIcon bg={active ? "#ff6bb5" : "var(--color-panel)"} />
                    )}
                    {tab.id === "history" && (
                      <BookIcon bg={active ? "#ff6bb5" : "var(--color-panel)"} />
                    )}
                    {tab.id === "music" && (
                      <MusicIcon bg={active ? "#ff6bb5" : "var(--color-panel)"} />
                    )}
                    {tab.id === "sena" && (
                      <BookIcon bg={active ? "#ff6bb5" : "var(--color-panel)"} />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

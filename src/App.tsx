import { useState, useEffect } from "react";
import { TimerDisplay } from "./modules/timer/TimerDisplay";
import { HistoryView } from "./modules/history/HistoryView";
import { useHistoryStore } from "./modules/history/historyStore";

type Tab = "timer" | "history";

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="14" height="14" fill="currentColor" />
      <rect x="2" y="2" width="12" height="12" fill="var(--color-bg)" />
      <rect x="7" y="4" width="2" height="5" fill="currentColor" />
      <rect x="7" y="8" width="4" height="2" fill="currentColor" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1" width="12" height="14" fill="currentColor" />
      <rect x="3" y="2" width="10" height="12" fill="var(--color-bg)" />
      <rect x="4" y="4" width="8" height="2" fill="currentColor" />
      <rect x="4" y="7" width="8" height="2" fill="currentColor" />
      <rect x="4" y="10" width="5" height="2" fill="currentColor" />
    </svg>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  useEffect(() => {
    useHistoryStore.getState().loadSessions();
    useHistoryStore.getState().loadUserState();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Content area */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "timer" ? <TimerDisplay /> : <HistoryView />}
      </div>

      {/* Pixel art bottom navigation */}
      <nav
        style={{
          display: "flex",
          background: "var(--color-surface)",
          borderTop: "3px solid var(--color-border)",
          boxShadow: "0 -3px 0 var(--color-pixel-shadow)",
          flexShrink: 0,
        }}
      >
        {(["timer", "history"] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "10px 0",
                background: active ? "var(--color-accent-green)" : "transparent",
                color: active ? "#fff" : "var(--color-text-muted)",
                border: "none",
                borderRight: tab === "timer" ? "3px solid var(--color-border)" : "none",
                cursor: "pointer",
                fontFamily: "var(--font-pixel)",
                fontSize: "var(--text-pixel-xs)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {tab === "timer" ? <ClockIcon /> : <BookIcon />}
              {tab === "timer" ? "ESTUDIAR" : "HISTORIAL"}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;

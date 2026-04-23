import { useState, useEffect } from "react";
import { TimerDisplay } from "./modules/timer/TimerDisplay";
import { HistoryView } from "./modules/history/HistoryView";
import { useHistoryStore } from "./modules/history/historyStore";
import { useSubjectStore } from "./modules/subjects/subjectStore";

type Tab = "timer" | "history";

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

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  useEffect(() => {
    useHistoryStore.getState().loadSessions();
    useHistoryStore.getState().loadUserState();
    useSubjectStore.getState().loadSubjects();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Content area */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
        {activeTab === "timer" ? (
          <TimerDisplay onNavigateToHistory={() => setActiveTab("history")} />
        ) : (
          <HistoryView />
        )}
      </div>

      {/* Pixel art bottom navigation */}
      <nav
        style={{
          display: "flex",
          background: "var(--color-surface)",
          borderTop: "3px solid var(--color-border)",
          boxShadow: "0 -3px 0 var(--color-pixel-shadow)",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        {(["timer", "history"] as Tab[]).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              className={`pixel-nav-btn ${active ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                color: active ? "#fff" : "var(--color-text-muted)",
                borderRight: tab === "timer" ? "3px solid var(--color-border)" : "none",
              }}
            >
              {tab === "timer" ? (
                <ClockIcon bg={active ? "#ff6bb5" : "var(--color-panel)"} />
              ) : (
                <BookIcon bg={active ? "#ff6bb5" : "var(--color-panel)"} />
              )}
              {tab === "timer" ? "ESTUDIAR" : "HISTORIAL"}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;

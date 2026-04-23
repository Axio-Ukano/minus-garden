import { useState, useEffect } from "react";
import { TimerDisplay } from "./modules/timer/TimerDisplay";
import { HistoryView } from "./modules/history/HistoryView";
import { useHistoryStore } from "./modules/history/historyStore";

type Tab = "timer" | "history";

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
        backgroundColor: "var(--color-bg)",
        fontFamily: "'Nunito', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-hearts)",
          backgroundColor: "var(--color-panel)",
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
                padding: "12px 0",
                background: "none",
                border: "none",
                borderBottom: active ? "2px solid var(--color-accent)" : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: active ? "var(--color-accent)" : "var(--color-text-muted)",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {tab === "timer" ? "⏱ Estudiar" : "📋 Historial"}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "timer" ? <TimerDisplay /> : <HistoryView />}
      </div>
    </div>
  );
}

export default App;

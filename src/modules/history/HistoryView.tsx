import { useEffect } from "react";
import { useHistoryStore } from "./historyStore";
import type { Session } from "./historyStore";

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateOnly.getTime() === today.getTime()) return `Hoy a las ${time}`;
  if (dateOnly.getTime() === yesterday.getTime()) return `Ayer a las ${time}`;

  const dd = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mo} a las ${time}`;
}

function SessionCard({ session, onDelete }: { session: Session; onDelete: () => void }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-panel)",
        borderRadius: "16px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        fontFamily: "'Nunito', sans-serif",
        border: "1.5px solid var(--color-hearts)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--color-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {session.subject || "Sin materia"}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
            marginTop: "3px",
          }}
        >
          {formatDate(session.start_time)}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-muted)",
          }}
        >
          {session.duration_minutes} min
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--color-accent)",
          }}
        >
          +{session.hearts_earned} 💗
        </span>
        <button
          onClick={onDelete}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "var(--color-text-muted)",
            lineHeight: 1,
            padding: "2px 4px",
            borderRadius: "6px",
            fontFamily: "'Nunito', sans-serif",
          }}
          aria-label="Borrar sesión"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function HistoryView() {
  const { sessions, totalHearts, loading, loadSessions, loadUserState, deleteSession } =
    useHistoryStore();

  useEffect(() => {
    loadSessions();
    loadUserState();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("¿Borrar esta sesión?")) deleteSession(id);
  };

  return (
    <div
      className="pixel-panel"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        fontFamily: "'Nunito', sans-serif",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      {/* Hearts header */}
      <div
        style={{
          textAlign: "center",
          fontSize: "22px",
          fontWeight: 800,
          color: "var(--color-accent)",
        }}
      >
        💗 {totalHearts} corazones acumulados
      </div>

      {/* Body */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontSize: "15px",
            marginTop: "32px",
          }}
        >
          Cargando tu historial...
        </div>
      ) : sessions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text)" }}>
            Aún no has estudiado hoy 🌱
          </span>
          <span style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            ¡Empieza tu primera sesión!
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={() => handleDelete(session.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

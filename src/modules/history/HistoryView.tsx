import { useEffect } from "react";
import { useHistoryStore } from "./historyStore";
import type { Session } from "./historyStore";
import { PlantDisplay } from "../plant/PlantDisplay";
import { getStageName } from "../plant/plantService";

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
  const stageName = getStageName(session.plant_stage, session.plant_species);

  return (
    <div
      className="pixel-panel"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
      }}
    >
      {/* Plant thumbnail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <PlantDisplay stage={session.plant_stage} species={session.plant_species} size="sm" />
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          {stageName.toUpperCase()}
        </span>
      </div>

      {/* Session info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-sm)",
            color: "var(--color-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 6,
          }}
        >
          {session.subject || "Sin materia"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          {formatDate(session.start_time)}
        </div>
      </div>

      {/* Stats + delete */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          {session.duration_minutes}m
        </span>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-heart)",
          }}
        >
          +{session.hearts_earned}♥
        </span>
        <button
          onClick={onDelete}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: "var(--color-text-muted)",
            lineHeight: 1,
            padding: "2px 4px",
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
          fontFamily: "var(--font-pixel)",
          fontSize: "var(--text-pixel-lg)",
          color: "var(--color-heart)",
        }}
      >
        ♥ {totalHearts} CORAZONES
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            fontFamily: "var(--font-pixel)",
            fontSize: "var(--text-pixel-xs)",
            color: "var(--color-text-muted)",
            marginTop: 32,
          }}
        >
          CARGANDO...
        </div>
      ) : sessions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <PlantDisplay stage={1} size="md" />
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-sm)",
              color: "var(--color-text)",
            }}
          >
            SIN SESIONES AÚN
          </span>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "var(--text-pixel-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            ¡Empieza a estudiar!
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

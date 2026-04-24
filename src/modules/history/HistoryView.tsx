import { useEffect } from "react";
import { useHistoryStore } from "./historyStore";
import type { Session } from "./historyStore";
import { PlantDisplay } from "../plants/PlantDisplay";
import { getStageName, getSpeciesById } from "../plants/plantService";
import { HeartIcon } from "../../components/HeartIcon";
import "../../components/Panel.css";
import "../../components/Button.css";
import "./HistoryView.css";

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
  const stageName = getStageName(session.plant_stage, getSpeciesById(session.plant_species));

  return (
    <div className="pixel-panel session-card">
      <div className="session-card__plant">
        <PlantDisplay stage={session.plant_stage} speciesId={session.plant_species} size="sm" />
        <span className="session-card__stage-name">{stageName.toUpperCase()}</span>
      </div>

      <div className="session-card__info">
        <div className="session-card__subject">{session.subject || "Sin materia"}</div>
        <div className="session-card__date">{formatDate(session.start_time)}</div>
      </div>

      <div className="session-card__stats">
        <span className="session-card__duration">{session.duration_minutes}m</span>
        <span className="session-card__hearts">
          +{session.hearts_earned} <HeartIcon size={12} color="currentColor" />
        </span>
        <button className="session-card__delete" onClick={onDelete} aria-label="Borrar sesión">
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
  }, [loadSessions, loadUserState]);

  const handleDelete = (id: string) => {
    if (confirm("¿Borrar esta sesión?")) deleteSession(id);
  };

  return (
    <div className="history-view">
      <div className="history-view__hearts">
        <HeartIcon size={20} color="currentColor" />
        <span>{totalHearts} CORAZONES</span>
      </div>

      {loading ? (
        <div className="history-view__loading">CARGANDO...</div>
      ) : sessions.length === 0 ? (
        <div className="history-view__empty">
          <PlantDisplay stage={1} size="md" />
          <span className="history-view__empty-title">SIN SESIONES AÚN</span>
          <span className="history-view__empty-sub">¡Empieza a estudiar!</span>
        </div>
      ) : (
        <div className="history-view__grid">
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

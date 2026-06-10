// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect } from "react";
import { useHistoryStore } from "./historyStore";
import type { Session } from "./historyStore";
import { PlantDisplay, getStageName, getSpeciesById } from "@/modules/plants";
import { HeartIcon } from "@/components/PixelIcons";
import { Panel } from "@/components/Panel";
import { useTranslation } from "../../i18n";
import "../../components/Button.css";
import "./HistoryView.css";

function formatDate(isoString: string, t: ReturnType<typeof useTranslation>["t"]): string {
  const date = new Date(isoString);
  const now = new Date();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateOnly.getTime() === today.getTime()) return `${t.history.date_today} ${time}`;
  if (dateOnly.getTime() === yesterday.getTime()) return `${t.history.date_yesterday} ${time}`;

  const dd = String(date.getDate()).padStart(2, "0");
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mo} ${t.history.date_at} ${time}`;
}

function SessionCard({ session, onDelete }: { session: Session; onDelete: () => void }) {
  const { t } = useTranslation();
  const species = getSpeciesById(session.plant_species);
  const stageName = getStageName(session.plant_stage, species, t);

  return (
    <Panel className="session-card" data-testid="session-card">
      <div className="session-card__plant">
        <PlantDisplay stage={session.plant_stage} speciesId={session.plant_species} size="sm" />
        <span className="session-card__stage-name">{stageName.toUpperCase()}</span>
      </div>

      <div className="session-card__info">
        <div className="session-card__subject">{session.subject || t.history.no_subject}</div>
        <div className="session-card__date">{formatDate(session.start_time, t)}</div>
      </div>

      <div className="session-card__stats">
        <span className="session-card__duration">{session.duration_minutes}m</span>
        <span className="session-card__hearts">
          +{session.hearts_earned} <HeartIcon size={12} color="currentColor" />
        </span>
        <button
          className="session-card__delete"
          onClick={onDelete}
          aria-label={t.history.delete_aria}
        >
          ×
        </button>
      </div>
    </Panel>
  );
}

export function HistoryView() {
  const { sessions, totalHearts, loading, loadSessions, loadUserState, deleteSession } =
    useHistoryStore();
  const { t } = useTranslation();

  useEffect(() => {
    void loadSessions();
    void loadUserState();
  }, [loadSessions, loadUserState]);

  const handleDelete = (id: string) => {
    if (confirm(t.history.delete_confirm)) void deleteSession(id);
  };

  return (
    <div className="history-view">
      <div className="history-view__hearts">
        <HeartIcon size={20} color="currentColor" />
        <span data-testid="history-hearts">
          {totalHearts} {t.history.hearts_label}
        </span>
      </div>

      {loading ? (
        <div className="history-view__loading">{t.history.loading}</div>
      ) : sessions.length === 0 ? (
        <div className="history-view__empty" data-testid="history-empty">
          <PlantDisplay stage={1} size="md" />
          <span className="history-view__empty-title">{t.history.empty_title}</span>
          <span className="history-view__empty-sub">{t.history.empty_sub}</span>
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

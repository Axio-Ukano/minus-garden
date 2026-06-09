// Domain types owned by the data layer. These describe the shape the rest of
// the app works with — independent of *how* they are fetched (today: Tauri IPC
// + SQLite; tomorrow possibly an HTTP API). Keeping them here, not inside a
// store, lets the transport change without touching feature modules.

/**
 * A study session. Field names are snake_case because this is the persisted
 * shape shared verbatim with the SQLite backend; it is treated as the canonical
 * domain record across timer/history.
 */
export interface Session {
  id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  subject: string;
  completed: boolean;
  hearts_earned: number;
  plant_species: string;
  plant_stage: number;
}

/** A study subject, mapped to camelCase for UI consumption. */
export interface Subject {
  id: string;
  name: string;
  color: string;
  useCount: number;
}

/** Aggregate user progression state. */
export interface UserState {
  totalHearts: number;
}

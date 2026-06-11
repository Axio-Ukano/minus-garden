// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

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

/**
 * Categories of ownable shop items. Only seeds exist today; the wire format
 * already carries the kind so future categories extend this union without a
 * schema change.
 */
export type InventoryKind = "seed" | "tool" | "decoration" | "upgrade" | "plot";

/** One owned item — for seeds, `itemId` is the plant species id. */
export interface InventoryItem {
  id: string;
  kind: InventoryKind;
  itemId: string;
  acquiredAt: string;
}

/** Outcome of a successful purchase: the granted item plus the new balance. */
export interface PurchaseOutcome {
  totalHearts: number;
  item: InventoryItem;
}

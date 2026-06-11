// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

// ─── Data repository boundary ────────────────────────────────────────────────
//
// The single seam between feature modules and the persistence transport. Every
// read/write of persisted state goes through `repository`; no store or
// component calls `tauriInvoke` (or `@tauri-apps/api`) directly. This is what
// makes future growth cheap:
//   - swap SQLite-over-IPC for an HTTP/sync backend → only this file changes;
//   - add caching, optimistic writes, or offline queues in one place;
//   - keep wire ⇄ domain mapping (snake_case ⇄ camelCase) out of the UI.
//
// See ADR-0005.

import { tauriInvoke } from "@/lib/tauri";
import type {
  InventoryItem,
  InventoryKind,
  PurchaseOutcome,
  Session,
  Subject,
  UserState,
} from "./types";

export type {
  InventoryItem,
  InventoryKind,
  PurchaseOutcome,
  Session,
  Subject,
  UserState,
} from "./types";

/** Raw row shapes as returned by the Rust commands (snake_case wire format). */
interface SubjectRow {
  id: string;
  name: string;
  color: string;
  use_count: number;
}

interface UserStateRow {
  total_hearts: number;
}

interface InventoryItemRow {
  id: string;
  kind: string;
  item_id: string;
  acquired_at: string;
}

interface PurchaseResultRow {
  total_hearts: number;
  item: InventoryItemRow;
}

function toSubject(row: SubjectRow): Subject {
  return { id: row.id, name: row.name, color: row.color, useCount: row.use_count };
}

function toInventoryItem(row: InventoryItemRow): InventoryItem {
  return {
    id: row.id,
    kind: row.kind as InventoryKind,
    itemId: row.item_id,
    acquiredAt: row.acquired_at,
  };
}

export const repository = {
  sessions: {
    list(): Promise<Session[]> {
      return tauriInvoke<Session[]>("get_sessions");
    },
    save(session: Session): Promise<void> {
      return tauriInvoke("save_session", { session });
    },
    remove(id: string): Promise<void> {
      return tauriInvoke("delete_session", { id });
    },
  },

  userState: {
    async get(): Promise<UserState> {
      const row = await tauriInvoke<UserStateRow>("get_user_state");
      return { totalHearts: row.total_hearts };
    },
    setHearts(totalHearts: number): Promise<void> {
      return tauriInvoke("update_hearts", { totalHearts });
    },
  },

  subjects: {
    async list(): Promise<Subject[]> {
      const rows = await tauriInvoke<SubjectRow[]>("get_subjects");
      return rows.map(toSubject);
    },
    create(name: string, color: string): Promise<void> {
      return tauriInvoke("save_subject", { name, color });
    },
    markUsed(id: string): Promise<void> {
      return tauriInvoke("update_subject_usage", { id });
    },
  },

  inventory: {
    async list(): Promise<InventoryItem[]> {
      const rows = await tauriInvoke<InventoryItemRow[]>("get_inventory");
      return rows.map(toInventoryItem);
    },
    /**
     * Atomic purchase: the backend deducts the hearts and grants the item in
     * one transaction, returning the new balance. Price is passed from the
     * client catalog — the client is the rules authority today (ADR-0007).
     */
    async purchase(kind: InventoryKind, itemId: string, price: number): Promise<PurchaseOutcome> {
      const row = await tauriInvoke<PurchaseResultRow>("purchase_item", { kind, itemId, price });
      return { totalHearts: row.total_hearts, item: toInventoryItem(row.item) };
    },
  },
} as const;

// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minu's Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import type { Page } from "@playwright/test";

// ─── Fake Tauri transport ─────────────────────────────────────────────────────
//
// Playwright drives the Vite frontend in a real browser, where Tauri's
// `window.__TAURI_INTERNALS__` does not exist and every `invoke` would throw.
// We inject an in-memory backend that implements the 8 commands with the SAME
// wire shapes as the Rust side (src-tauri/src/commands.rs), so the real React
// app + repository + stores run end-to-end against deterministic, seedable data.
// Only SQLite/Rust is stubbed — see ADR-0009.

/** Session wire shape (snake_case), identical to the Rust `Session`. */
export interface FakeSession {
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

/** Subject wire shape (snake_case), identical to the Rust `Subject` row. */
export interface FakeSubject {
  id: string;
  name: string;
  color: string;
  use_count: number;
}

/** Inventory item wire shape (snake_case), identical to the Rust `InventoryItem` row. */
export interface FakeInventoryItem {
  id: string;
  kind: string;
  item_id: string;
  acquired_at: string;
}

export interface FakeSeed {
  sessions?: FakeSession[];
  totalHearts?: number;
  subjects?: FakeSubject[];
  /** Inventory rows to pre-populate. Defaults to [{starter-daisy seed}]. */
  inventory?: FakeInventoryItem[];
}

/**
 * Installs the in-memory Tauri backend on the page (before navigation). Seed is
 * fully parameterizable so specs can start from any state (empty, pre-populated
 * history, custom subjects). Defaults mirror the Rust migration seed.
 */
export async function installFakeTauri(page: Page, seed: FakeSeed = {}): Promise<void> {
  await page.addInitScript((seedData: FakeSeed) => {
    const sessions: FakeSession[] = [...(seedData.sessions ?? [])];
    let totalHearts: number = seedData.totalHearts ?? 0;
    const subjects: FakeSubject[] = [
      ...(seedData.subjects ?? [
        { id: "seed-math", name: "Mathematics", color: "#e8a0b4", use_count: 0 },
        { id: "seed-history", name: "History", color: "#a0c4e8", use_count: 0 },
        { id: "seed-science", name: "Science", color: "#a0e8b4", use_count: 0 },
      ]),
    ];
    // Default inventory: every garden starts with the starter daisy seed.
    const inventory: FakeInventoryItem[] = [
      ...(seedData.inventory ?? [
        {
          id: "starter-daisy",
          kind: "seed",
          item_id: "daisy",
          acquired_at: new Date().toISOString(),
        },
      ]),
    ];

    type Payload = Record<string, unknown>;

    const invoke = (cmd: string, payload: Payload = {}): Promise<unknown> => {
      switch (cmd) {
        case "get_sessions":
          return Promise.resolve(
            [...sessions].sort((a, b) => b.start_time.localeCompare(a.start_time))
          );
        case "save_session": {
          const session = payload.session as FakeSession;
          const idx = sessions.findIndex((s) => s.id === session.id);
          if (idx >= 0) sessions[idx] = session;
          else sessions.push(session);
          return Promise.resolve();
        }
        case "delete_session": {
          const id = payload.id as string;
          const idx = sessions.findIndex((s) => s.id === id);
          if (idx >= 0) sessions.splice(idx, 1);
          return Promise.resolve();
        }
        case "get_user_state":
          return Promise.resolve({ total_hearts: totalHearts });
        case "update_hearts":
          totalHearts = payload.totalHearts as number;
          return Promise.resolve();
        case "get_subjects":
          return Promise.resolve([...subjects].sort((a, b) => b.use_count - a.use_count));
        case "save_subject": {
          const name = payload.name as string;
          const color = payload.color as string;
          if (subjects.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
            return Promise.reject("Subject name already exists");
          }
          const created: FakeSubject = {
            id: `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name,
            color,
            use_count: 0,
          };
          subjects.push(created);
          return Promise.resolve(created);
        }
        case "update_subject_usage": {
          const id = payload.id as string;
          const subject = subjects.find((s) => s.id === id);
          if (subject) subject.use_count += 1;
          return Promise.resolve();
        }
        case "get_inventory":
          return Promise.resolve([...inventory]);
        case "purchase_item": {
          const kind = payload.kind as string;
          const itemId = payload.itemId as string;
          const price = payload.price as number;
          if (price < 0) return Promise.reject("Invalid price");
          if (!itemId) return Promise.reject("Invalid item");
          // Same check order as purchase_item_tx (commands.rs): ownership
          // before hearts, so a re-purchase with an empty wallet surfaces
          // "already owned" — not "not enough hearts" — exactly like prod.
          if (inventory.some((i) => i.kind === kind && i.item_id === itemId)) {
            return Promise.reject("Item already owned");
          }
          if (totalHearts < price) return Promise.reject("Not enough hearts");
          totalHearts -= price;
          const newItem: FakeInventoryItem = {
            id: `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            kind,
            item_id: itemId,
            acquired_at: new Date().toISOString(),
          };
          inventory.push(newItem);
          return Promise.resolve({ total_hearts: totalHearts, item: newItem });
        }
        default:
          return Promise.reject(`Unknown command: ${cmd}`);
      }
    };

    (window as unknown as { __TAURI_INTERNALS__: { invoke: typeof invoke } }).__TAURI_INTERNALS__ =
      { invoke };
  }, seed);
}

/** Installs the fake backend and navigates to the app root. */
export async function gotoApp(page: Page, seed: FakeSeed = {}): Promise<void> {
  await installFakeTauri(page, seed);
  await page.goto("/");
}

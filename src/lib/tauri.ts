import { invoke, type InvokeArgs } from "@tauri-apps/api/core";
import { useSettingsStore } from "@/modules/settings";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";
import type { Translations } from "@/i18n";
import { pushToast } from "./toast";

export type TauriCommand =
  | "save_session"
  | "get_sessions"
  | "delete_session"
  | "get_user_state"
  | "update_hearts"
  | "get_subjects"
  | "save_subject"
  | "update_subject_usage";

export class TauriError extends Error {
  command: TauriCommand;
  raw: string;
  constructor(command: TauriCommand, raw: string) {
    super(raw);
    this.name = "TauriError";
    this.command = command;
    this.raw = raw;
  }
}

type ErrorKey = keyof Translations["error"];

// Map each command's failure to a localized fallback message. Special-case
// the duplicate-name error (Rust returns the literal English string from
// commands.rs) to a more specific key.
const COMMAND_ERROR_KEY: Record<TauriCommand, ErrorKey> = {
  save_session: "session_save_failed",
  get_sessions: "session_load_failed",
  delete_session: "session_delete_failed",
  get_user_state: "user_state_load_failed",
  update_hearts: "hearts_update_failed",
  get_subjects: "subjects_load_failed",
  save_subject: "subject_save_failed",
  update_subject_usage: "subject_usage_failed",
};

function localize(command: TauriCommand, raw: string): string {
  const language = useSettingsStore.getState().language;
  const t = (language === "es" ? es : en) as Translations;
  if (raw === "Subject name already exists") return t.error.subject_name_taken;
  return t.error[COMMAND_ERROR_KEY[command]] ?? t.error.generic;
}

/**
 * Typed wrapper around Tauri's `invoke`. On failure: surfaces a localized
 * toast, logs to console, and re-throws a `TauriError` so callers can react
 * (e.g. block a UI flow). Successful calls return the deserialized value.
 */
export async function tauriInvoke<T>(command: TauriCommand, args?: InvokeArgs): Promise<T> {
  try {
    return await invoke<T>(command, args);
  } catch (e) {
    const raw = typeof e === "string" ? e : e instanceof Error ? e.message : String(e);
    const message = localize(command, raw);
    console.error(`[tauriInvoke:${command}]`, raw);
    pushToast(message, "error");
    throw new TauriError(command, raw);
  }
}

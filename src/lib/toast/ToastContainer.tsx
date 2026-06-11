// Copyright (c) 2024–2026 Carlos Pico (Axio-Ukano)
// Minus Garden · https://github.com/Axio-Ukano/minus-garden
// SPDX-License-Identifier: CC-BY-NC-ND-4.0

import { useEffect, useState } from "react";
import { useToastStore, type ToastEntry } from "./toastStore";
import { useTranslation } from "@/i18n";
import "./ToastContainer.css";

const TOAST_TTL_MS = 4000;
const FADE_MS = 300;

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="pixel-toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastEntry; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);
  // Leaving is tied to the seq it was triggered for, so a re-push (seq bump)
  // cancels an in-progress fade-out without extra state writes.
  const [leavingSeq, setLeavingSeq] = useState<number | null>(null);
  const leaving = leavingSeq === toast.seq;
  const { t } = useTranslation();

  // Mount hidden, then flip visible on the next tick so the CSS entry
  // transition plays.
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(show);
  }, []);

  // Each toast owns its own countdown. Re-pushing an identical message bumps
  // `seq`, which restarts the countdown (and the progress bar via its key).
  useEffect(() => {
    const hide = setTimeout(() => setLeavingSeq(toast.seq), TOAST_TTL_MS);
    return () => clearTimeout(hide);
  }, [toast.seq]);

  // Wait for the fade-out transition before removing from the store.
  useEffect(() => {
    if (!leaving) return;
    const remove = setTimeout(() => onDismiss(toast.id), FADE_MS);
    return () => clearTimeout(remove);
  }, [leaving, toast.id, onDismiss]);

  return (
    <div
      className={`pixel-toast pixel-toast--${toast.kind} ${visible && !leaving ? "visible" : ""}`}
      data-testid="toast"
    >
      <span className="pixel-toast-message">{toast.message}</span>
      <button
        className="pixel-toast-close"
        aria-label={t.common.close}
        onClick={() => setLeavingSeq(toast.seq)}
      >
        X
      </button>
      <div
        key={toast.seq}
        className="pixel-toast-progress"
        style={{ animationDuration: `${TOAST_TTL_MS}ms` }}
      />
    </div>
  );
}

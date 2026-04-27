import { useEffect } from "react";
import { useToastStore } from "./toastStore";
import "./Toast.css";
import "./ToastContainer.css";

const TOAST_TTL_MS = 4000;
const FADE_MS = 300;

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), TOAST_TTL_MS + FADE_MS));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="pixel-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`pixel-toast visible pixel-toast--${t.kind}`}>
          {t.message}
          <div
            className="pixel-toast-progress"
            style={{ animationDuration: `${TOAST_TTL_MS}ms` }}
          />
        </div>
      ))}
    </div>
  );
}

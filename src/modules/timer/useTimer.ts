import { useEffect, useRef } from "react";
import { useTimerStore } from "./timerStore";

export function useTimer() {
  const { status, tick } = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, tick]);

  // Re-sync immediately when the window becomes visible again: the interval
  // is throttled while hidden, so without this the display (and a finish that
  // came due in the background) would lag until the next interval firing.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const store = useTimerStore.getState();
      if (store.status === "running" && store.endAt !== null) store.tick();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);
}

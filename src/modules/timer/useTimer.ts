import { useEffect, useRef } from "react";
import { useTimerStore } from "./timerStore";
import { saveSession } from "./sessionStore";

export function useTimer() {
  const { status, durationMinutes, subject, tick, addHearts } = useTimerStore();
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "running") {
      if (!startTimeRef.current) {
        startTimeRef.current = new Date();
      }
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    if (status === "finished" && startTimeRef.current) {
      const endTime = new Date();
      saveSession({
        startTime: startTimeRef.current,
        endTime,
        durationMinutes,
        subject,
        completed: true,
      });
      const heartsEarned = Math.floor(durationMinutes / 5);
      if (heartsEarned > 0) addHearts(heartsEarned);
      startTimeRef.current = null;
    }

    if (status === "idle") {
      startTimeRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);
}

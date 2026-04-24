import { useTimerStore } from "./timerStore";
import { useTimer } from "./useTimer";

import { TimerSetupView } from "./views/TimerSetupView";
import { TimerActiveView } from "./views/TimerActiveView";
import { TimerFinishedView } from "./views/TimerFinishedView";

export function TimerDisplay({ onNavigateToHistory }: { onNavigateToHistory: () => void }) {
  useTimer();

  const { status } = useTimerStore();

  if (status === "finished") {
    return <TimerFinishedView onNavigateToHistory={onNavigateToHistory} />;
  }

  if (status === "idle") {
    return <TimerSetupView />;
  }

  return <TimerActiveView />;
}

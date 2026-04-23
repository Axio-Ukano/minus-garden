export interface StudySession {
  id: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  subject: string;
  completed: boolean;
}

const sessions: StudySession[] = [];

export function saveSession(session: Omit<StudySession, "id">): StudySession {
  const newSession: StudySession = {
    ...session,
    id: crypto.randomUUID(),
  };
  sessions.push(newSession);
  return newSession;
}

export function getSessions(): StudySession[] {
  return [...sessions];
}

import { z } from "zod";
import {
  sessionCookieName,
  sessionDurationSeconds,
} from "@/data/constants/auth";
import type { AuthUser } from "@/data/types/auth";
import { getUsers } from "./users";

export { sessionCookieName, sessionDurationSeconds };
const storageKey = "marketplace-nfts:mock-sessions:v1";
const sessionsSchema = z.array(
  z.object({
    id: z.uuid(),
    userId: z.string().min(1),
    expiresAt: z.number().int().positive(),
  }),
);
type MockSession = z.infer<typeof sessionsSchema>[number];
let memorySessions: MockSession[] = [];

const readSessions = (): MockSession[] => {
  if (typeof window === "undefined") return memorySessions;
  const stored = window.localStorage.getItem(storageKey);
  return stored ? sessionsSchema.parse(JSON.parse(stored)) : [];
};

const saveSessions = (sessions: MockSession[]) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(sessions));
  }
  memorySessions = sessions;
};

export const createSession = (userId: string) => {
  const now = Date.now();
  const session: MockSession = {
    id: crypto.randomUUID(),
    userId,
    expiresAt: now + sessionDurationSeconds * 1_000,
  };
  saveSessions([
    ...readSessions().filter((entry) => entry.expiresAt > now),
    session,
  ]);
  return session;
};

export const deleteSession = (sessionId?: string) => {
  if (!sessionId) return;
  saveSessions(readSessions().filter((entry) => entry.id !== sessionId));
};

export const getSessionUser = (sessionId?: string): AuthUser | null => {
  if (!sessionId) return null;
  const session = readSessions().find((entry) => entry.id === sessionId);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    deleteSession(session.id);
    return null;
  }
  const user = getUsers().find((entry) => entry.id === session.userId);
  if (!user) {
    deleteSession(session.id);
    return null;
  }
  return { id: user.id, username: user.username, email: user.email };
};

export const resetSessions = () => saveSessions([]);

import { getSessionUser } from "../database/sessions";
import { subscribeMockEvents } from "./bus";

export type MockClient = {
  sessionId?: string;
  userId?: string;
  ready: boolean;
  emit: (name: string, data?: unknown) => void;
  close: () => void;
};

const clients = new Set<MockClient>();
const blockedUntil = new Map<string, number>();

export const connectionBlocked = (userId?: string) =>
  (blockedUntil.get(userId ?? "visitor") ?? 0) > Date.now();

export const registerClient = (client: MockClient) => {
  clients.add(client);
  return () => {
    clients.delete(client);
  };
};

export const disconnectClients = (userId?: string, milliseconds = 2000) => {
  blockedUntil.set(userId ?? "visitor", Date.now() + milliseconds);
  for (const client of Array.from(clients))
    if (client.userId === userId) client.close();
};

export const countClients = (userId?: string) =>
  Array.from(clients).filter(
    (client) => client.ready && client.userId === userId,
  ).length;

subscribeMockEvents((event) => {
  for (const client of Array.from(clients)) {
    if (!client.ready) continue;

    const isExpired =
      client.sessionId &&
      getSessionUser(client.sessionId)?.id !== client.userId;

    if (isExpired) {
      client.emit("session.expired");
      client.close();
      continue;
    }

    if (event.type === "order.updated" && event.data.userId !== client.userId)
      continue;

    try {
      client.emit(event.type, event.data);
    } catch {
      client.close();
      clients.delete(client);
    }
  }
});

export const expireClients = (userId: string) => {
  for (const client of Array.from(clients)) {
    if (client.userId !== userId) continue;
    client.emit("session.expired");
    client.close();
  }
};

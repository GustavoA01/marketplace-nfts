import type {
  NFTUpdatedEvent,
  OrderUpdatedEvent,
} from "@/data/schemas/realtime";

export type MockEvent =
  | { type: "nft.updated"; data: NFTUpdatedEvent }
  | { type: "order.updated"; data: OrderUpdatedEvent };

const listeners = new Set<(event: MockEvent) => void>();
const history = new Map<string, MockEvent>();

export const publishMockEvent = (event: MockEvent) => {
  const key =
    event.type === "nft.updated" ? event.data.nftId : event.data.userId;
  history.set(`${event.type}:${key}`, structuredClone(event));
  for (const listener of Array.from(listeners)) listener(event);
};

export const subscribeMockEvents = (listener: (event: MockEvent) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const replayMockEvent = (key: string, outdated = false) => {
  const saved = history.get(key);
  if (!saved) return false;

  const event = structuredClone(saved);
  if (outdated) {
    event.data.eventId = crypto.randomUUID();
    event.data.version = Math.max(1, event.data.version - 1);
    if (event.type === "nft.updated") event.data.price = "0.01";
    else event.data.status = "pending";
  }

  for (const listener of Array.from(listeners)) listener(event);

  return true;
};

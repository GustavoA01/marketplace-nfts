import type { StoredOrder } from "@/data/schemas/orders";
import { publishMockEvent } from "./bus";

export const publishOrderUpdate = (order: StoredOrder) => {
  publishMockEvent({
    type: "order.updated",
    data: {
      eventId: crypto.randomUUID(),
      orderId: order.id,
      attemptKey: order.attemptKey,
      userId: order.userId,
      status: order.status,
      version: order.version,
    },
  });
};

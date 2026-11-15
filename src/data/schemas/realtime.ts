import { z } from "zod";

export const decimalPrice = z
  .string()
  .max(40)
  .regex(/^(0|[1-9]\d*)(\.\d{1,18})?$/);

const eventIdentity = {
  eventId: z.uuid(),
  version: z.number().int().positive().safe(),
};

export const nftUpdatedSchema = z.object({
  ...eventIdentity,
  nftId: z.string().min(1),
  price: decimalPrice,
  availableQuantity: z.number().int().nonnegative().safe(),
  reason: z.enum(["market", "purchase"]).default("market"),
});

export const orderUpdatedSchema = z.object({
  ...eventIdentity,
  orderId: z.uuid(),
  attemptKey: z.uuid(),
  userId: z.string().min(1),
  status: z.enum(["pending", "confirmed", "declined"]),
});

export type NFTUpdatedEvent = z.infer<typeof nftUpdatedSchema>;
export type OrderUpdatedEvent = z.infer<typeof orderUpdatedSchema>;

export type ServerEvents = {
  "nft.updated": (event: NFTUpdatedEvent) => void;
  "order.updated": (event: OrderUpdatedEvent) => void;
  "session.ready": (event: { userId: string | null }) => void;
  "session.expired": () => void;
};

export type ClientEvents = {
  "session.authenticate": (event: { sessionId?: string }) => void;
  "context.watch": (event: { pathname: string }) => void;
};

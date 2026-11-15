import { z } from "zod";
import { decimalPrice } from "@/data/schemas/realtime";

export const realtimeCommands = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("update-nft"),
    nftId: z.string(),
    price: decimalPrice.optional(),
    supply: z.number().int().nonnegative().max(1_000_000).optional(),
  }),
  z.object({ action: z.literal("run-scenario") }),
  z.object({ action: z.literal("expire-session") }),
  z.object({
    action: z.literal("replay-nft"),
    nftId: z.string(),
    outdated: z.boolean().default(false),
  }),
  z.object({
    action: z.literal("replay-order"),
    outdated: z.boolean().default(false),
  }),
  z.object({
    action: z.literal("disconnect"),
    milliseconds: z.number().int().min(0).max(30_000).default(2000),
  }),
  z.object({
    action: z.literal("settle-order"),
    delay: z.number().int().min(0).max(30_000).default(0),
    attempt: z.uuid(),
    outcome: z.enum(["confirmed", "declined"]).default("confirmed"),
  }),
  z.object({ action: z.literal("reset-market") }),
]);

export type RealtimeCommand = z.infer<typeof realtimeCommands>;
export type RealtimeAction = RealtimeCommand["action"];

export type RealtimeCommandContext = {
  request: Request;
  userId?: string;
};

export type RealtimeCommandHandler<A extends RealtimeAction = RealtimeAction> =
  (
    command: Extract<RealtimeCommand, { action: A }>,
    context: RealtimeCommandContext,
  ) => Response | Promise<Response>;

import { HttpResponse } from "msw/http";
import { replayMockEvent } from "../../realtime/bus";
import type { RealtimeCommandHandler } from "./schema";
import { requireRealtimeUserId } from "./utils";

export const replayOrderCommand: RealtimeCommandHandler<"replay-order"> = (
  command,
  { userId },
) => {
  const user = requireRealtimeUserId(userId);

  if (user instanceof Response) return user;

  return HttpResponse.json({
    replayed: replayMockEvent(`order.updated:${user.userId}`, command.outdated),
  });
};

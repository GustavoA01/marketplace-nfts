import { HttpResponse } from "msw/http";
import { disconnectClients } from "../../realtime/clients";
import type { RealtimeCommandHandler } from "./schema";

export const disconnectCommand: RealtimeCommandHandler<"disconnect"> = (
  command,
  { userId },
) => {
  disconnectClients(userId, command.milliseconds);

  return HttpResponse.json({ disconnected: true });
};

import { HttpResponse } from "msw/http";
import { deleteSession } from "../../database/sessions";
import { expireClients } from "../../realtime/clients";
import { requestSessionId } from "../auth/utils";
import type { RealtimeCommandHandler } from "./schema";
import { requireRealtimeUserId } from "./utils";

export const expireSessionCommand: RealtimeCommandHandler<"expire-session"> = (
  _command,
  { request, userId },
) => {
  const user = requireRealtimeUserId(userId);

  if (user instanceof Response) return user;

  deleteSession(requestSessionId(request));
  expireClients(user.userId);

  return HttpResponse.json({ expired: true });
};

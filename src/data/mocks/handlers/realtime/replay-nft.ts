import { HttpResponse } from "msw/http";
import { replayMockEvent } from "../../realtime/bus";
import type { RealtimeCommandHandler } from "./schema";

export const replayNftCommand: RealtimeCommandHandler<"replay-nft"> = (
  command,
) =>
  HttpResponse.json({
    replayed: replayMockEvent(`nft.updated:${command.nftId}`, command.outdated),
  });

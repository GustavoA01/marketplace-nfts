import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { cartUser } from "../cart/utils";
import { disconnectCommand } from "./disconnect";
import { expireSessionCommand } from "./expire-session";
import { replayNftCommand } from "./replay-nft";
import { replayOrderCommand } from "./replay-order";
import { resetMarketCommand } from "./reset-market";
import { runScenarioCommand } from "./run-scenario";
import {
  realtimeCommands,
  type RealtimeAction,
  type RealtimeCommand,
  type RealtimeCommandContext,
  type RealtimeCommandHandler,
} from "./schema";
import { settleOrderCommand } from "./settle-order";
import { updateNftCommand } from "./update-nft";
import { realtimeCommandError } from "./utils";

const commandHandlers: {
  [A in RealtimeAction]: RealtimeCommandHandler<A>;
} = {
  "update-nft": updateNftCommand,
  "run-scenario": runScenarioCommand,
  "expire-session": expireSessionCommand,
  "replay-nft": replayNftCommand,
  "replay-order": replayOrderCommand,
  disconnect: disconnectCommand,
  "settle-order": settleOrderCommand,
  "reset-market": resetMarketCommand,
};

const runCommand = (
  command: RealtimeCommand,
  context: RealtimeCommandContext,
) => {
  const handler = commandHandlers[command.action] as (
    command: RealtimeCommand,
    context: RealtimeCommandContext,
  ) => Response | Promise<Response>;

  return handler(command, context);
};

export const postRealtimeHandler: HttpResponseResolver = async ({
  request,
}) => {
  try {
    const user = cartUser(request);

    if (user instanceof Response) return user;

    const result = realtimeCommands.safeParse(await request.json());

    if (!result.success)
      return HttpResponse.json(
        { message: "Comando inválido." },
        { status: 422 },
      );

    return await runCommand(result.data, {
      request,
      userId: user.userId,
    });
  } catch {
    return realtimeCommandError();
  }
};

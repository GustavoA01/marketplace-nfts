import { HttpResponse } from "msw/http";
import { runMarketScenario } from "../../realtime/scenarios";
import type { RealtimeCommandHandler } from "./schema";

export const runScenarioCommand: RealtimeCommandHandler<"run-scenario"> = (
  _command,
  { userId },
) =>
  HttpResponse.json({
    event: runMarketScenario(userId) ?? null,
  });

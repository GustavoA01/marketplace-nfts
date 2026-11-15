import { http } from "msw/http";
import { realtimeConnectionHandler } from "./connection";
import { getRealtimeHandler } from "./get";
import { postRealtimeHandler } from "./post";

const realtimePrefix = "/api/mock/realtime";

export const realtimeHandlers = [
  realtimeConnectionHandler,
  http.get(realtimePrefix, getRealtimeHandler),
  http.post(realtimePrefix, postRealtimeHandler),
];

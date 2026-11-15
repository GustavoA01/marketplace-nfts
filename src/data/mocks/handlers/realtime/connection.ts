import { ws } from "msw/ws";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { z } from "zod";
import { getSessionUser } from "../../database/sessions";
import {
  connectionBlocked,
  registerClient,
  type MockClient,
} from "../../realtime/clients";
import { resumeOrderDecisions } from "../../realtime/order-timers";
import { armCartScenario } from "../../realtime/scenarios";

const live = ws.link(/^(ws|wss):\/\/[^/]+\/?$/);

export const realtimeConnectionHandler = live.addEventListener(
  "connection",
  (connection) => {
    if (!connection.client.url.searchParams.has("EIO")) {
      connection.server.connect();
      return;
    }

    const bound = toSocketIo(connection);
    const client: MockClient = {
      ready: false,
      emit: (name, data) => bound.client.emit(name, data),
      close: () => {
        client.ready = false;
        setTimeout(
          () => connection.client.close(1012, "Reconecte para continuar."),
          0,
        );
      },
    };
    const unregister = registerClient(client);
    const heartbeat = setInterval(() => connection.client.send("2"), 20_000);

    connection.client.addEventListener("close", () => {
      clearInterval(heartbeat);
      unregister();
    });

    bound.client.on("session.authenticate", (_event, payload: unknown) => {
      const result = z
        .object({ sessionId: z.string().optional() })
        .safeParse(payload);

      if (!result.success) {
        client.close();
        return;
      }

      client.sessionId = result.data.sessionId;
      const user = getSessionUser(client.sessionId);

      if (client.sessionId && !user) {
        client.emit("session.expired");
        client.close();
        return;
      }

      client.userId = user?.id;

      if (connectionBlocked(client.userId)) {
        client.close();
        return;
      }

      client.ready = true;
      client.emit("session.ready", { userId: user?.id ?? null });
      resumeOrderDecisions();
    });

    bound.client.on("context.watch", (_event, payload: unknown) => {
      const result = z.object({ pathname: z.string() }).safeParse(payload);

      if (
        client.ready &&
        result.success &&
        /^\/(carrinho|pagamento)(\/|$)/.test(result.data.pathname)
      )
        armCartScenario(client.userId);
    });
  },
);

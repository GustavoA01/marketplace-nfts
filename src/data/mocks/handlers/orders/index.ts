import { http, HttpResponse } from "msw/http";
import { delay } from "msw";
import { z } from "zod";
import { createOrderSchema } from "@/data/schemas/orders";
import { cartUser } from "../cart/utils";
import { createOrder } from "../../database/orders-create";
import { consultOrder } from "../../database/orders-settle";
import {
  readOrders,
  saveOrders,
  paymentScenario,
} from "../../database/orders-store";
import { getWalletByIdForUser } from "../../database/wallets";

const auth = (request: Request) => {
  const user = cartUser(request);
  if (user instanceof Response) return user;
  return (
    user.userId ??
    HttpResponse.json({ message: "Entre para continuar." }, { status: 401 })
  );
};
const readJSON = async (request: Request) => {
  try {
    return { body: await request.json() };
  } catch {
    return {
      error: HttpResponse.json(
        { message: "Envie JSON válido." },
        { status: 400 },
      ),
    };
  }
};

const failure = () =>
  HttpResponse.json(
    { message: "Não foi possível processar o pagamento. Tente novamente." },
    { status: 503 },
  );
export const orderHandlers = [
  http.post("/api/wallet-connections", async ({ request }) => {
    try {
      const json = await readJSON(request);
      if (json.error) return json.error;
      const body = z
        .strictObject({ walletId: z.string().min(1) })
        .safeParse(json.body);
      await delay(200);
      const user = auth(request);
      if (user instanceof Response) return user;
      if (!body.success)
        return HttpResponse.json(
          { message: "Selecione uma carteira." },
          { status: 422 },
        );
      const wallet = getWalletByIdForUser(body.data.walletId, user);
      if (!wallet)
        return HttpResponse.json(
          { message: "Carteira não encontrada." },
          { status: 404 },
        );
      if (paymentScenario() === "wallet-refused")
        return HttpResponse.json(
          { message: "Conexão recusada pela carteira. Tente novamente." },
          { status: 409 },
        );
      const connection = {
        id: crypto.randomUUID(),
        userId: user,
        walletId: wallet.id,
        network: wallet.network,
        address: wallet.address,
        expiresAt: Date.now() + 900_000,
        connected: true,
      };
      const store = readOrders();
      store.connections.push(connection);
      saveOrders(store);
      return HttpResponse.json({
        connection: { id: connection.id, walletId: wallet.id },
      });
    } catch {
      return failure();
    }
  }),
  http.delete("/api/wallet-connections/:id", ({ request, params }) => {
    try {
      const user = auth(request);
      if (user instanceof Response) return user;
      const store = readOrders();
      const connection = store.connections.find(
        (entry) => entry.id === params.id && entry.userId === user,
      );
      if (!connection)
        return HttpResponse.json(
          { message: "Conexão não encontrada." },
          { status: 404 },
        );
      connection.connected = false;
      saveOrders(store);
      return new HttpResponse(null, { status: 204 });
    } catch {
      return failure();
    }
  }),
  http.post("/api/orders", async ({ request }) => {
    try {
      const json = await readJSON(request);
      if (json.error) return json.error;
      const body = createOrderSchema.safeParse(json.body);
      const user = auth(request);
      if (user instanceof Response) return user;
      const key = z.uuid().safeParse(request.headers.get("Idempotency-Key"));
      if (!body.success || !key.success)
        return HttpResponse.json(
          { message: "Confira os dados do colecionador e da tentativa." },
          { status: 422 },
        );
      if (paymentScenario() === "offline") return HttpResponse.error();
      const result = createOrder(user, key.data, body.data);
      if ("error" in result)
        return HttpResponse.json(
          { message: result.error },
          { status: result.status },
        );
      if (paymentScenario() === "timeout-after-create") await delay(16_000);
      return HttpResponse.json({ order: result.order }, { status: 201 });
    } catch {
      return failure();
    }
  }),
  http.get("/api/orders", ({ request }) => {
    try {
      const user = auth(request);
      if (user instanceof Response) return user;
      if (paymentScenario() === "offline") return HttpResponse.error();
      const order = consultOrder(
        user,
        undefined,
        new URL(request.url).searchParams.get("attempt") ?? "",
      );
      return order
        ? HttpResponse.json({ order })
        : HttpResponse.json(
            {
              message:
                "Pedido ainda não encontrado. Consulte ou reenvie a mesma tentativa.",
            },
            { status: 404 },
          );
    } catch {
      return failure();
    }
  }),
  http.get("/api/orders/:id", ({ request, params }) => {
    try {
      const user = auth(request);
      if (user instanceof Response) return user;
      const order = consultOrder(user, String(params.id));
      return order
        ? HttpResponse.json({ order })
        : HttpResponse.json(
            { message: "Pedido não encontrado." },
            { status: 404 },
          );
    } catch {
      return failure();
    }
  }),
];

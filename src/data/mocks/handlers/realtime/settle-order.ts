import { HttpResponse } from "msw/http";
import { consultOrder } from "../../database/orders-settle";
import {
  publicOrder,
  readOrders,
  saveOrders,
} from "../../database/orders-store";
import { scheduleOrderDecision } from "../../realtime/order-timers";
import type { RealtimeCommandHandler } from "./schema";
import { requireRealtimeUserId } from "./utils";

export const settleOrderCommand: RealtimeCommandHandler<"settle-order"> = (
  command,
  { userId },
) => {
  const user = requireRealtimeUserId(userId);

  if (user instanceof Response) return user;

  const store = readOrders();
  const order = store.orders.find(
    (entry) =>
      entry.userId === user.userId && entry.attemptKey === command.attempt,
  );

  if (!order)
    return HttpResponse.json(
      { message: "Pedido não encontrado." },
      { status: 404 },
    );

  if (order.status !== "pending")
    return HttpResponse.json(
      { message: "Pedido já finalizado." },
      { status: 409 },
    );

  order.settlesAt = Date.now() + command.delay;
  order.outcome = command.outcome;
  saveOrders(store);

  scheduleOrderDecision(user.userId, order.id, order.settlesAt);

  return HttpResponse.json({
    order: command.delay
      ? publicOrder(order)
      : consultOrder(user.userId, order.id),
  });
};

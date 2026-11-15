import { readOrders } from "../database/orders-store";
import { consultOrder } from "../database/orders-settle";

const timers = new Map<
  string,
  { timer: ReturnType<typeof setTimeout>; settlesAt: number }
>();

export const scheduleOrderDecision = (
  userId: string,
  orderId: string,
  settlesAt: number,
  retry = 0,
) => {
  const current = timers.get(orderId);
  if (current?.settlesAt === settlesAt) return;
  if (current) clearTimeout(current.timer);

  const timer = setTimeout(
    () => {
      timers.delete(orderId);

      try {
        consultOrder(userId, orderId);
      } catch {
        if (retry < 3)
          scheduleOrderDecision(userId, orderId, Date.now() + 1000, retry + 1);
      }
    },
    Math.max(0, settlesAt - Date.now()) + 20,
  );

  timers.set(orderId, { timer, settlesAt });
};

export const resumeOrderDecisions = () => {
  for (const order of readOrders().orders)
    if (order.status === "pending")
      scheduleOrderDecision(order.userId, order.id, order.settlesAt);
};

import { z } from "zod";
import {
  connectionSchema,
  storedOrderSchema,
  type StoredOrder,
  type Order,
} from "@/data/schemas/orders";
const schema = z.object({
  orders: z.array(storedOrderSchema),
  connections: z.array(connectionSchema),
});
type Store = z.infer<typeof schema>;
let memory: Store = { orders: [], connections: [] };
const key = "marketplace-nfts:mock-orders:v1";
export const readOrders = (): Store => {
  if (typeof window === "undefined") return structuredClone(memory);
  const value = window.localStorage.getItem(key);
  const store = value
    ? schema.parse(JSON.parse(value))
    : { orders: [], connections: [] };
  for (const order of store.orders) {
    if (order.reason === "Pagamento recusado na simulação.")
      order.reason =
        "Pagamento recusado. Revise os dados ou utilize outra carteira.";
  }
  return store;
};
export const saveOrders = (store: Store) => {
  if (typeof window !== "undefined")
    window.localStorage.setItem(key, JSON.stringify(store));
  memory = structuredClone(store);
};
export const publicOrder = (order: StoredOrder): Order => {
  const { userId, fingerprint, settlesAt, outcome, ...result } = order;
  void userId;
  void fingerprint;
  void settlesAt;
  void outcome;
  return structuredClone(result);
};
export const paymentScenario = () => {
  try {
    return localStorage.getItem("marketplace-nfts:payment-scenario");
  } catch {
    return null;
  }
};
export const resetOrders = () => saveOrders({ orders: [], connections: [] });

import { http } from "@/lib/http";
import type { CreateOrderPayload, Order } from "@/data/schemas/orders";
export const submitOrder = async (key: string, payload: CreateOrderPayload) => {
  const { data } = await http.post<{ order: Order }>("/orders", payload, {
    headers: { "Idempotency-Key": key },
  });
  return data.order;
};
export const getOrder = async (attempt: string, signal?: AbortSignal) => {
  const { data } = await http.get<{ order: Order }>("/orders", {
    params: { attempt },
    signal,
  });
  return data.order;
};
export const connectWallet = async (walletId: string) => {
  const { data } = await http.post<{
    connection: { id: string; walletId: string };
  }>("/wallet-connections", { walletId });
  return data.connection;
};
export const disconnectWallet = async (id: string) => {
  await http.delete(`/wallet-connections/${encodeURIComponent(id)}`);
};

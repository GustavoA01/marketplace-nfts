import type { CartResponse } from "@/data/types/cart";
import { http } from "@/lib/http";

export const getCart = async (signal?: AbortSignal) => {
  const { data } = await http.get<CartResponse>("/cart", { signal });
  return data.cart;
};

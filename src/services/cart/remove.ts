import type { CartResponse } from "@/data/types/cart";
import { http } from "@/lib/http";

export const removeCartItem = async (id: string) => {
  const { data } = await http.delete<CartResponse>(
    `/cart/items/${encodeURIComponent(id)}`,
  );
  return data.cart;
};

import type { CartResponse, UpdateCartItemPayload } from "@/data/types/cart";
import { http } from "@/lib/http";

export const updateCartItem = async (
  id: string,
  payload: UpdateCartItemPayload,
) => {
  const { data } = await http.patch<CartResponse>(
    `/cart/items/${encodeURIComponent(id)}`,
    payload,
  );
  return data.cart;
};

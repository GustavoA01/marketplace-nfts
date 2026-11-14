import type { AddCartItemPayload, CartResponse } from "@/data/types/cart";
import { http } from "@/lib/http";

export const addCartItem = async (payload: AddCartItemPayload) => {
  const { data } = await http.post<CartResponse>("/cart/items", payload);
  return data.cart;
};

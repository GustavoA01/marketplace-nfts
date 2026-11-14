import type { CartResponse } from "@/data/types/cart";
import { http } from "@/lib/http";

export const applyCartCoupon = async (code: string) => {
  const { data } = await http.post<CartResponse>("/cart/coupon", { code });
  return data.cart;
};

export const removeCartCoupon = async () => {
  const { data } = await http.delete<CartResponse>("/cart/coupon");
  return data.cart;
};

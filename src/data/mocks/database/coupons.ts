import type { Cart, CartApiError } from "@/data/types/cart";
import { couponFixtures } from "../fixtures/coupons";
import { buildCart } from "./cart-read";
import { readCartStore, saveCartStore, storedCartItems } from "./cart-storage";

export const validateCoupon = (
  code: string,
): { percentage: number } | { error: CartApiError } => {
  const coupon = couponFixtures.find((entry) => entry.code === code);
  if (!coupon)
    return {
      error: {
        code: "COUPON_INVALID",
        message: "Cupom inválido.",
        errors: { couponCode: "Confira o código informado." },
      },
    };
  if (coupon.expiresAt && Date.parse(coupon.expiresAt) <= Date.now())
    return {
      error: {
        code: "COUPON_EXPIRED",
        message: "Este cupom expirou.",
        errors: { couponCode: "Informe um cupom válido." },
      },
    };
  return { percentage: coupon.percentage };
};

export const setCartCoupon = (
  code: string | null,
  userId?: string,
): { cart: Cart } | { error: CartApiError; status: 422 } => {
  if (code) {
    const validation = validateCoupon(code);
    if ("error" in validation) return { error: validation.error, status: 422 };
  }
  const store = readCartStore();
  const cart = buildCart(storedCartItems(store, userId), code);
  store.coupons[userId ?? "visitor"] = code;
  saveCartStore(store);
  return { cart };
};

import type { Cart, CartItem } from "@/data/types/cart";
import { ethToWei, weiToEth } from "./eth";

export const summarizeCart = (
  items: CartItem[],
  couponCode: string | null = null,
): Cart => ({
  items,
  totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
  subtotal: weiToEth(
    items.reduce((total, item) => total + ethToWei(item.lineTotal), BigInt(0)),
  ),
  currency: "ETH",
  couponCode,
});

export const cartSignature = (cart: Cart) =>
  JSON.stringify({
    couponCode: cart.couponCode,
    items: cart.items.map((item) => [
      item.id,
      item.nftId,
      item.edition,
      item.quantity,
      item.unitPrice,
      item.maxQuantity,
      item.isAvailable,
      item.network,
    ]),
  });

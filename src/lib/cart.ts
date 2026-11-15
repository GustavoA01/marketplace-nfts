import type { QuoteNetwork } from "@/data/types/quote";
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

export const getCartNetwork = (
  cart?: Pick<Cart, "items">,
): QuoteNetwork | undefined => {
  const networks = Array.from(
    new Set(
      (cart?.items ?? []).map((item) => item.network.trim().toLowerCase()),
    ),
  );
  const network = networks[0];
  return networks.length === 1 &&
    (network === "ethereum" || network === "polygon" || network === "solana")
    ? network
    : undefined;
};

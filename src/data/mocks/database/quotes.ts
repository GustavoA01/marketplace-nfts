import type { Quote, QuoteApiError, QuotePayload } from "@/data/types/quote";
import { cartSignature, getCartNetwork } from "@/lib/cart";
import { ethToWei, weiToEth } from "@/lib/eth";
import { networkFeeFixtures } from "../fixtures/coupons";
import { getCart } from "./cart";
import { validateCoupon } from "./coupons";

const quotes = new Map<string, { ownerId: string; quote: Quote }>();

type QuoteResult =
  { quote: Quote } | { error: QuoteApiError; status: 409 | 422 };

export const createQuote = (
  payload: QuotePayload,
  userId?: string,
): QuoteResult => {
  const cart = getCart(userId);

  if (payload.cartSignature !== cartSignature(cart))
    return {
      status: 409,
      error: {
        code: "CART_CHANGED",
        message: "Seu carrinho mudou. Os valores serão atualizados.",
        cart,
      },
    };

  if (!cart.items.length)
    return {
      status: 409,
      error: {
        code: "EMPTY_CART",
        message: "Adicione um NFT antes de calcular a compra.",
        cart,
      },
    };

  if (cart.items.some((item) => !item.isAvailable))
    return {
      status: 409,
      error: {
        code: "INSUFFICIENT_STOCK",
        message: "Ajuste os itens indisponíveis antes de continuar.",
        cart,
      },
    };

  let percentage = 0;

  if (cart.couponCode) {
    const validation = validateCoupon(cart.couponCode);

    if ("error" in validation) return { status: 422, error: validation.error };

    percentage = validation.percentage;
  }

  const network = getCartNetwork(cart);

  if (!network)
    return {
      status: 409,
      error: {
        code: "NETWORK_MISMATCH",
        message:
          "Finalize uma rede por vez. Mantenha no carrinho apenas NFTs de uma mesma rede.",
        cart,
      },
    };

  if (payload.network && payload.network !== network)
    return {
      status: 409,
      error: {
        code: "NETWORK_MISMATCH",
        message: "A rede da carteira deve ser a mesma dos NFTs do carrinho.",
        cart,
      },
    };

  const subtotal = ethToWei(cart.subtotal);
  const discount = (subtotal * BigInt(percentage)) / BigInt(100);
  const fee = ethToWei(networkFeeFixtures[network]);
  const now = Date.now();

  const quote: Quote = {
    id: crypto.randomUUID(),
    cartSignature: cartSignature(cart),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 5 * 60_000).toISOString(),
    network,
    couponCode: cart.couponCode,
    items: structuredClone(cart.items),
    summary: {
      subtotal: cart.subtotal,
      discount: weiToEth(discount),
      networkFee: weiToEth(fee),
      total: weiToEth(subtotal - discount + fee),
    },
  };

  for (const [id, entry] of Array.from(quotes))
    if (Date.parse(entry.quote.expiresAt) <= now) quotes.delete(id);

  if (quotes.size >= 100) {
    const oldest = quotes.keys().next().value;
    if (oldest) quotes.delete(oldest);
  }

  quotes.set(quote.id, {
    ownerId: userId ?? "visitor",
    quote: structuredClone(quote),
  });

  return { quote };
};

export const getQuoteForUser = (id: string, userId?: string) => {
  const entry = quotes.get(id);

  if (
    !entry ||
    Date.parse(entry.quote.expiresAt) <= Date.now() ||
    entry.ownerId !== (userId ?? "visitor")
  )
    return undefined;

  return structuredClone(entry.quote);
};

export const resetQuotes = () => quotes.clear();

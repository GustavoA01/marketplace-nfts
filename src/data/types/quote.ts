import type { Cart, CartApiError, CartItem } from "./cart";
import type { PriceSummary } from "./purchase";

export type QuoteNetwork = "ethereum" | "polygon" | "solana";
export type QuotePayload = { cartSignature: string; network?: QuoteNetwork };
export type Quote = {
  id: string;
  cartSignature: string;
  createdAt: string;
  expiresAt: string;
  network: QuoteNetwork;
  couponCode: string | null;
  items: CartItem[];
  summary: PriceSummary;
};
export type QuoteResponse = { quote: Quote };
export type QuoteApiError = CartApiError & { cart?: Cart };

import type { CreateOrderPayload, StoredOrder } from "@/data/schemas/orders";
import {
  readOrders,
  saveOrders,
  publicOrder,
  paymentScenario,
} from "./orders-store";
import { getQuoteForUser, createQuote } from "./quotes";
import { getCart } from "./cart";
import { cartSignature } from "@/lib/cart";
import { getWalletByIdForUser } from "./wallets";
import { consultOrder } from "./orders-settle";

export const createOrder = (
  userId: string,
  key: string,
  payload: CreateOrderPayload,
) => {
  const store = readOrders();
  const fingerprint = JSON.stringify(payload);
  const existing = store.orders.find(
    (entry) => entry.userId === userId && entry.attemptKey === key,
  );
  if (existing)
    return existing.fingerprint === fingerprint
      ? { order: consultOrder(userId, existing.id)! }
      : {
          error: "A chave desta tentativa já foi usada com outros dados.",
          status: 409,
        };
  const quote = getQuoteForUser(payload.quoteId, userId);
  if (!quote)
    return {
      error: "A cotação expirou. Recalcule e revise os valores.",
      status: 409,
    };
  const connection = store.connections.find(
    (entry) =>
      entry.id === payload.connectionId &&
      entry.userId === userId &&
      entry.connected &&
      entry.expiresAt > Date.now(),
  );
  const wallet =
    connection && getWalletByIdForUser(connection.walletId, userId);
  if (
    !wallet ||
    !connection ||
    wallet.network !== quote.network ||
    wallet.network !== connection.network ||
    wallet.address !== connection.address
  )
    return {
      error: "Conecte uma carteira válida na rede da cotação.",
      status: 409,
    };
  const current = getCart(userId);
  if (cartSignature(current) !== quote.cartSignature)
    return {
      error: "O carrinho mudou. Recalcule e confirme os novos valores.",
      status: 409,
    };
  const validation = createQuote(
    { cartSignature: quote.cartSignature, network: quote.network },
    userId,
  );
  if ("error" in validation)
    return { error: validation.error.message, status: validation.status };
  if (
    JSON.stringify(validation.quote.summary) !== JSON.stringify(quote.summary)
  )
    return {
      error: "Os valores mudaram. Revise uma nova cotação.",
      status: 409,
    };
  const now = new Date().toISOString();
  const order: StoredOrder = {
    id: crypto.randomUUID(),
    attemptKey: key,
    userId,
    fingerprint,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    transaction: null,
    settlesAt: Date.now() + (paymentScenario() === "pending" ? 60_000 : 1500),
    outcome:
      paymentScenario() === "payment-declined" ? "declined" : "confirmed",
    collector: payload.collector,
    wallet: {
      id: wallet.id,
      name: wallet.alias,
      address: wallet.address,
      network: wallet.network,
    },
    summary: structuredClone(quote.summary),
    items: quote.items.map((item) => ({
      id: item.id,
      nftId: item.nftId,
      name: item.name,
      token: item.nftId,
      edition: item.edition,
      image: item.image,
      quantity: item.quantity,
      price: item.unitPrice,
      total: item.lineTotal,
    })),
  };
  store.orders.push(order);
  saveOrders(store);
  return { order: publicOrder(order) };
};

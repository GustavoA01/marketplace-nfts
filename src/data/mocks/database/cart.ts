import type { AddCartItemPayload, Cart, CartApiError } from "@/data/types/cart";
import { nfts } from "../fixtures/nfts";
import { buildCart } from "./cart-read";
import {
  readCartStore,
  saveCartStore,
  setStoredCartItems,
  storedCartItems,
  type StoredCartItem,
} from "./cart-storage";
import { getEditionStock } from "./inventory";

export type CartResult =
  | { cart: Cart; created?: boolean }
  | { error: CartApiError; status: 404 | 409 };

const stockError = (
  nftId: string,
  edition: string,
  quantity: number,
  items: StoredCartItem[],
  excludedId?: string,
): CartResult | undefined => {
  const nft = nfts.find((item) => item.id === nftId);
  if (!nft)
    return {
      status: 404,
      error: { code: "NFT_NOT_FOUND", message: "NFT não encontrado." },
    };

  const stock = getEditionStock(nft, edition);
  if (stock < 1)
    return {
      status: 409,
      error: {
        code: "EDITION_UNAVAILABLE",
        message: "Esta edição não está disponível.",
        errors: { edition: "Selecione uma edição disponível." },
      },
    };

  const others = items
    .filter((item) => item.nftId === nftId && item.id !== excludedId)
    .reduce((total, item) => total + item.quantity, 0);
  const available = Math.max(
    0,
    Math.min(stock, nft.availableQuantity - others),
  );

  if (quantity > available)
    return {
      status: 409,
      error: {
        code: "INSUFFICIENT_STOCK",
        message: "Quantidade acima do estoque disponível.",
        errors: { quantity: `Quantidade máxima nesta edição: ${available}.` },
      },
    };
};

export const getCart = (userId?: string): Cart => {
  const store = readCartStore();
  return buildCart(
    storedCartItems(store, userId),
    store.coupons[userId ?? "visitor"] ?? null,
  );
};

export const addCartItem = (
  payload: AddCartItemPayload,
  userId?: string,
): CartResult => {
  const store = readCartStore();
  const items = storedCartItems(store, userId);
  const existing = items.find(
    (item) => item.nftId === payload.nftId && item.edition === payload.edition,
  );
  const quantity = (existing?.quantity ?? 0) + payload.quantity;

  const error = stockError(
    payload.nftId,
    payload.edition,
    quantity,
    items,
    existing?.id,
  );

  if (error) return error;
  if (existing) existing.quantity = quantity;
  else items.push({ id: crypto.randomUUID(), ...payload });

  setStoredCartItems(store, items, userId);
  const cart = buildCart(items, store.coupons[userId ?? "visitor"] ?? null);
  saveCartStore(store);

  return { cart, created: !existing };
};

export const updateCartItem = (
  id: string,
  quantity: number,
  userId?: string,
): CartResult => {
  const store = readCartStore();
  const items = storedCartItems(store, userId);
  const item = items.find((entry) => entry.id === id);

  if (!item)
    return {
      status: 404,
      error: {
        code: "ITEM_NOT_FOUND",
        message: "Item não encontrado no seu carrinho.",
      },
    };

  const error = stockError(item.nftId, item.edition, quantity, items, id);
  if (error) return error;
  item.quantity = quantity;
  const cart = buildCart(items, store.coupons[userId ?? "visitor"] ?? null);
  saveCartStore(store);

  return { cart };
};

export const removeCartItem = (id: string, userId?: string): CartResult => {
  const store = readCartStore();
  const items = storedCartItems(store, userId);

  if (!items.some((item) => item.id === id))
    return {
      status: 404,
      error: {
        code: "ITEM_NOT_FOUND",
        message: "Item não encontrado no seu carrinho.",
      },
    };

  const remaining = items.filter((item) => item.id !== id);
  setStoredCartItems(store, remaining, userId);
  const cart = buildCart(remaining, store.coupons[userId ?? "visitor"] ?? null);
  saveCartStore(store);

  return { cart };
};

export const mergeVisitorCart = (userId: string) => {
  const store = readCartStore();
  if (!store.visitor.length) return;
  const items = storedCartItems(store, userId);

  for (const visitor of store.visitor) {
    const existing = items.find(
      (item) =>
        item.nftId === visitor.nftId && item.edition === visitor.edition,
    );
    if (existing) {
      const quantity = existing.quantity + visitor.quantity;
      if (!Number.isSafeInteger(quantity))
        throw new Error("Quantidade inválida.");
      existing.quantity = quantity;
    } else items.push(visitor);
  }

  store.users[userId] = items;
  store.coupons[userId] ??= store.coupons.visitor ?? null;
  delete store.coupons.visitor;
  store.visitor = [];

  saveCartStore(store);
};

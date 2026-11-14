import { z } from "zod";

const itemSchema = z.object({
  id: z.uuid(),
  nftId: z.string().min(1),
  edition: z.string().min(1),
  quantity: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
});
const itemsSchema = z.array(itemSchema);
const storeSchema = z.object({
  visitor: itemsSchema,
  users: z.record(z.string(), itemsSchema),
  coupons: z.record(z.string(), z.string().nullable()).default({}),
});
export type StoredCartItem = z.infer<typeof itemSchema>;
export type CartStore = z.infer<typeof storeSchema>;
const storageKey = "marketplace-nfts:mock-carts:v1";
const legacyKey = "marketplace-nfts:mock-visitor-cart:v1";
let memoryStore: CartStore = { visitor: [], users: {}, coupons: {} };

export const readCartStore = (): CartStore => {
  if (typeof window === "undefined") return structuredClone(memoryStore);
  const stored = window.localStorage.getItem(storageKey);
  if (stored) return storeSchema.parse(JSON.parse(stored));
  const legacy = window.localStorage.getItem(legacyKey);
  return {
    visitor: legacy ? itemsSchema.parse(JSON.parse(legacy)) : [],
    users: {},
    coupons: {},
  };
};

export const saveCartStore = (store: CartStore) => {
  if (typeof window !== "undefined")
    window.localStorage.setItem(storageKey, JSON.stringify(store));
  memoryStore = structuredClone(store);
};

export const storedCartItems = (store: CartStore, userId?: string) =>
  userId ? (store.users[userId] ?? []) : store.visitor;

export const setStoredCartItems = (
  store: CartStore,
  items: StoredCartItem[],
  userId?: string,
) => {
  if (userId) store.users[userId] = items;
  else store.visitor = items;
};

export const resetCarts = () =>
  saveCartStore({ visitor: [], users: {}, coupons: {} });

export const resetVisitorCart = () => {
  const store = readCartStore();
  store.visitor = [];
  delete store.coupons.visitor;
  saveCartStore(store);
};

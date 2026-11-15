import { z } from "zod";
import type { NFT } from "@/data/types/nft";
import { decimalPrice } from "@/data/schemas/realtime";

const schema = z.record(
  z.string(),
  z.object({
    version: z.number().int().positive().safe(),
    price: decimalPrice.optional(),
    supply: z.number().int().nonnegative().safe().optional(),
  }),
);

type MarketStore = z.infer<typeof schema>;
const key = "marketplace-nfts:mock-market:v1";
let memory: MarketStore = {};

const readMarket = (): MarketStore => {
  if (typeof window === "undefined") return structuredClone(memory);
  const stored = window.localStorage.getItem(key);

  return stored ? schema.parse(JSON.parse(stored)) : {};
};

const saveMarket = (store: MarketStore) => {
  if (typeof window !== "undefined")
    window.localStorage.setItem(key, JSON.stringify(store));
  memory = structuredClone(store);
};

export const getNFTPrice = (nft: NFT) =>
  readMarket()[nft.id]?.price ?? nft.price;

export const getNFTSupply = (nft: NFT) =>
  readMarket()[nft.id]?.supply ?? nft.availableQuantity;

export const getNFTVersion = (id: string) => readMarket()[id]?.version ?? 1;

export const updateMarket = (
  id: string,
  patch: { price?: string; supply?: number },
) => {
  const store = readMarket();
  store[id] = {
    ...store[id],
    ...(patch.price !== undefined ? { price: patch.price } : {}),
    ...(patch.supply !== undefined ? { supply: patch.supply } : {}),
    version: (store[id]?.version ?? 1) + 1,
  };
  saveMarket(schema.parse(store));
};

export const resetMarket = () => saveMarket({});

import { getNFTPrice, getNFTSupply, getNFTVersion } from "./market-store";
import { readCartStore } from "./cart-storage";
import type { NFT } from "@/data/types/nft";
import { editionStockFixtures } from "../fixtures/nft-inventory";

export const getNFTStock = (nft: NFT) =>
  Math.max(
    0,
    getNFTSupply(nft) - (readCartStore().stockAdjustments[nft.id] ?? 0),
  );

export const getEditionStock = (nft: NFT, edition: string): number => {
  if (!nft.editions.includes(edition)) return 0;
  const stock =
    editionStockFixtures[nft.id]?.[edition] ??
    (edition === "1/1" ? 1 : nft.availableQuantity);
  return Math.max(
    0,
    Math.min(
      stock -
        (readCartStore().editionAdjustments[
          JSON.stringify([nft.id, edition])
        ] ?? 0),
      getNFTStock(nft),
    ),
  );
};

export const getEditionAvailability = (nft: NFT) =>
  Object.fromEntries(
    nft.editions.map((edition) => [edition, getEditionStock(nft, edition)]),
  );

export const getPublicNFT = (nft: NFT): NFT => ({
  ...nft,
  price: getNFTPrice(nft),
  availableQuantity: getNFTStock(nft),
  version: getNFTVersion(nft.id),
});

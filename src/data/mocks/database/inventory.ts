import type { NFT } from "@/data/types/nft";
import { editionStockFixtures } from "../fixtures/nft-inventory";

export const getEditionStock = (nft: NFT, edition: string): number => {
  if (!nft.editions.includes(edition)) return 0;
  const stock =
    editionStockFixtures[nft.id]?.[edition] ??
    (edition === "1/1" ? 1 : nft.availableQuantity);
  return Math.max(0, Math.min(stock, nft.availableQuantity));
};

export const getEditionAvailability = (nft: NFT) =>
  Object.fromEntries(
    nft.editions.map((edition) => [edition, getEditionStock(nft, edition)]),
  );

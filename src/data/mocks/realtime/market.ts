import type { NFTUpdatedEvent } from "@/data/schemas/realtime";
import { nfts } from "../fixtures/nfts";
import {
  updateMarket,
  getNFTPrice,
  getNFTVersion,
} from "../database/market-store";
import { getNFTStock } from "../database/inventory";
import { publishMockEvent } from "./bus";

export const changeNFT = (
  nftId: string,
  patch: { price?: string; supply?: number },
  reason: NFTUpdatedEvent["reason"] = "market",
) => {
  const nft = nfts.find((entry) => entry.id === nftId);
  if (!nft) return undefined;

  updateMarket(nftId, patch);

  const data: NFTUpdatedEvent = {
    eventId: crypto.randomUUID(),
    nftId,
    version: getNFTVersion(nftId),
    price: getNFTPrice(nft),
    availableQuantity: getNFTStock(nft),
    reason,
  };

  publishMockEvent({ type: "nft.updated", data });

  return data;
};

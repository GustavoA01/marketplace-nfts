import { HttpResponse } from "msw/http";
import { nfts } from "../../fixtures/nfts";
import { changeNFT } from "../../realtime/market";
import type { RealtimeCommandHandler } from "./schema";

export const resetMarketCommand: RealtimeCommandHandler<
  "reset-market"
> = () => {
  for (const nft of nfts)
    changeNFT(nft.id, {
      price: nft.price,
      supply: nft.availableQuantity,
    });

  return HttpResponse.json({ reset: true });
};

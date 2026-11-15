import { HttpResponse } from "msw/http";
import { changeNFT } from "../../realtime/market";
import type { RealtimeCommandHandler } from "./schema";

export const updateNftCommand: RealtimeCommandHandler<"update-nft"> = (
  command,
) => {
  const event = changeNFT(command.nftId, {
    price: command.price,
    supply: command.supply,
  });

  if (!event)
    return HttpResponse.json(
      { message: "NFT não encontrado." },
      { status: 404 },
    );

  return HttpResponse.json({ event });
};

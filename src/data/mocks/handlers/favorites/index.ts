import { http, HttpResponse, type HttpResponseResolver } from "msw/http";
import type { Favorites } from "@/data/types/favorites";
import { getSessionUser } from "../../database/sessions";
import { getFavoriteIds, setFavorite } from "../../database/favorites";
import { getNFTStock } from "../../database/inventory";
import { nfts } from "../../fixtures/nfts";
import { simulateFavoriteRequest } from "../../scenarios/favorites";
import { requestSessionId } from "../auth/utils";

const favoritesHandler: HttpResponseResolver = async ({ request, params }) => {
  try {
    const scenario = await simulateFavoriteRequest(request);
    if (scenario instanceof Response) return scenario;
    const user = getSessionUser(requestSessionId(request));
    if (!user)
      return HttpResponse.json(
        { message: "Entre na sua conta para continuar." },
        {
          status: 401,
        },
      );
    if (request.method === "GET") {
      const nftIds = getFavoriteIds(user.id);
      return HttpResponse.json<Favorites>({
        nftIds,
        items: nfts
          .filter((nft) => nftIds.includes(nft.id))
          .map((nft) => ({ ...nft, availableQuantity: getNFTStock(nft) })),
      });
    }
    const nft = nfts.find((entry) => entry.id === params.nftId);
    if (!nft)
      return HttpResponse.json(
        { message: "NFT não encontrado." },
        { status: 404 },
      );
    return HttpResponse.json(
      setFavorite(user.id, nft.id, request.method === "PUT"),
    );
  } catch {
    return HttpResponse.json(
      {
        message:
          "Não foi possível carregar ou salvar os favoritos. Tente novamente.",
      },
      { status: 503 },
    );
  }
};

export const favoriteHandlers = [
  http.get("/api/favorites", favoritesHandler),
  http.put("/api/favorites/:nftId", favoritesHandler),
  http.delete("/api/favorites/:nftId", favoritesHandler),
];

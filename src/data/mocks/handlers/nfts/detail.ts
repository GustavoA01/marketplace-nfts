import { HttpResponse, type HttpResponseResolver } from "msw/http";
import type { NFTDetail } from "@/data/types/catalogue";
import { nfts } from "../../fixtures/nfts";
import { nftDetailFixtures } from "../../fixtures/nft-details";
import { simulateCatalogueRequest } from "../../scenarios/catalogue";

export const nftDetailHandler: HttpResponseResolver = async ({
  request,
  params,
}) => {
  const scenario = await simulateCatalogueRequest(request);
  if (scenario instanceof Response) return scenario;
  const nft = nfts.find((item) => item.id === params.id);
  if (!nft)
    return HttpResponse.json(
      { message: "NFT não encontrado." },
      { status: 404 },
    );
  const extra = nftDetailFixtures[nft.id];
  return HttpResponse.json<NFTDetail>({
    ...nft,
    defaultEdition: nft.editions[0] ?? "",
    gallery: [
      {
        image: nft.image,
        mobileImage: nft.image,
        description: nft.imageDescription,
      },
    ],
    token: nft.id,
    attributes: nft.category,
    paragraphs: [nft.description],
    metadata: [
      { label: "Rede", value: nft.network },
      { label: "Criador", value: nft.creator },
      { label: "Coleção", value: nft.collection },
    ],
    ...extra,
  });
};

import type { CatalogueSearch, NFTListResponse } from "@/data/types/catalogue";
import { http } from "@/lib/http";

export const getNFTs = async (
  params: CatalogueSearch,
  signal?: AbortSignal,
): Promise<NFTListResponse> => {
  const { data } = await http.get<NFTListResponse>("/nfts", {
    params,
    paramsSerializer: { indexes: null },
    signal,
  });
  return data;
};

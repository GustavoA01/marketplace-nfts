import type { NFTDetail } from "@/data/types/catalogue";
import { http } from "@/lib/http";

export const getNFT = async (
  id: string,
  signal?: AbortSignal,
): Promise<NFTDetail> => {
  const { data } = await http.get<NFTDetail>(
    `/nfts/${encodeURIComponent(id)}`,
    {
      signal,
    },
  );
  return data;
};

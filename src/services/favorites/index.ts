import { http } from "@/lib/http";
import type { FavoriteResult, Favorites } from "@/data/types/favorites";

export const getFavorites = async (signal?: AbortSignal) => {
  const { data } = await http.get<Favorites>("/favorites", { signal });
  return data;
};

export const updateFavorite = async (nftId: string, isFavorite: boolean) => {
  const path = `/favorites/${encodeURIComponent(nftId)}`;
  const { data } = isFavorite
    ? await http.put<FavoriteResult>(path)
    : await http.delete<FavoriteResult>(path);
  return data;
};

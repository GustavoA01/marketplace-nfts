import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { queryKeys } from "@/data/query-keys";
import type { AuthUser } from "@/data/types/auth";
import type { Favorites } from "@/data/types/favorites";
import { getFavorites } from "@/services/favorites";

export const favoritesQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: queryKeys.favorites.list(userId),
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(userId),
    meta: { ownerId: userId },
    retry: (attempt, error) =>
      !(isAxiosError(error) && error.response && error.response.status < 500) &&
      attempt < 1,
  });

export const isFavoriteOwnerActive = (client: QueryClient, userId: string) =>
  client.getQueryData<AuthUser | null>(queryKeys.auth.session)?.id === userId;

export const updateFavoriteCache = (
  client: QueryClient,
  userId: string,
  nftId: string,
  isFavorite: boolean,
) => {
  if (!isFavoriteOwnerActive(client, userId)) return;
  client.setQueryData<Favorites>(
    queryKeys.favorites.list(userId),
    (previous) => {
      if (!previous) return previous;
      const nftIds = previous.nftIds.filter((id) => id !== nftId);
      if (isFavorite) nftIds.push(nftId);
      return { ...previous, nftIds };
    },
  );
};

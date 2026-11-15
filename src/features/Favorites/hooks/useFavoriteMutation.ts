import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "@/data/query-keys";
import type { FavoriteChange, Favorites } from "@/data/types/favorites";
import {
  isFavoriteOwnerActive,
  updateFavoriteCache,
} from "@/lib/favorites-query";
import { updateFavorite } from "@/services/favorites";

export const useFavoriteMutation = (
  nftId: string,
  userId: string | undefined,
  onAuthRequired: () => void,
) => {
  const client = useQueryClient();
  const mutationKey = queryKeys.favorites.change(userId);
  const mutationFilter = {
    mutationKey,
    predicate: (mutation: { state: { variables?: unknown } }) =>
      (mutation.state.variables as FavoriteChange | undefined)?.nftId === nftId,
  };
  const isSaving = useIsMutating(mutationFilter) > 0;
  const { mutate: saveFavorite } = useMutation({
    mutationKey,
    meta: { ownerId: userId },
    mutationFn: ({ nftId, isFavorite, ownerId }: FavoriteChange) => {
      if (!isFavoriteOwnerActive(client, ownerId))
        throw new Error("Sessão alterada.");
      return updateFavorite(nftId, isFavorite);
    },
    retry: false,
    onMutate: async ({ nftId, isFavorite, ownerId }) => {
      await client.cancelQueries({
        queryKey: queryKeys.favorites.list(ownerId),
      });
      if (!isFavoriteOwnerActive(client, ownerId)) return;
      const previous = client.getQueryData<Favorites>(
        queryKeys.favorites.list(ownerId),
      );
      const wasFavorite = previous?.nftIds.includes(nftId) ?? false;
      updateFavoriteCache(client, ownerId, nftId, isFavorite);
      return { wasFavorite };
    },
    onSuccess: (result, { ownerId }) => {
      if (!isFavoriteOwnerActive(client, ownerId)) return;
      updateFavoriteCache(client, ownerId, result.nftId, result.isFavorite);
      toast.success(
        result.isFavorite
          ? "NFT adicionado aos favoritos."
          : "NFT removido dos favoritos.",
      );
    },
    onError: (error, { ownerId, nftId }, context) => {
      if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        client.getQueryData(queryKeys.auth.session) === null
      ) {
        toast.error("Sua sessão expirou. Entre novamente para favoritar.");
        onAuthRequired();
        return;
      }
      if (!isFavoriteOwnerActive(client, ownerId)) return;
      if (context)
        updateFavoriteCache(client, ownerId, nftId, context.wasFavorite);
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(
        message ?? "Não foi possível atualizar os favoritos. Tente novamente.",
      );
    },
    onSettled: (_result, _error, { ownerId }) => {
      if (
        isFavoriteOwnerActive(client, ownerId) &&
        client.isMutating({
          mutationKey: queryKeys.favorites.change(ownerId),
        }) === 1
      )
        return client.invalidateQueries({
          queryKey: queryKeys.favorites.list(ownerId),
        });
    },
  });
  const mutate = (change: FavoriteChange) => {
    if (client.isMutating(mutationFilter)) return;
    saveFavorite(change);
  };
  return { mutate, isSaving };
};

import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/data/query-keys";
import type { Cart } from "@/data/types/cart";

export const reconcileResources = async (
  client: QueryClient,
  ownerId: string | undefined,
  active: () => boolean,
  nftId?: string,
) => {
  if (!active()) return;

  const cart = client.getQueryData<Cart>(queryKeys.cart.current(ownerId));
  const cartAffected =
    !nftId || cart?.items.some((item) => item.nftId === nftId);

  await Promise.all([
    client.invalidateQueries({ queryKey: queryKeys.nfts.all }),
    ...(cartAffected
      ? [
          client.invalidateQueries({
            queryKey: queryKeys.cart.current(ownerId),
          }),
        ]
      : []),
    ...(ownerId
      ? [
          client.invalidateQueries({
            queryKey: queryKeys.favorites.list(ownerId),
          }),
        ]
      : []),
    ...(!nftId && ownerId
      ? [client.invalidateQueries({ queryKey: ["orders", ownerId] })]
      : []),
  ]);

  if (cartAffected && active())
    await client.invalidateQueries({ queryKey: queryKeys.quotes.all });
};

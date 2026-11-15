import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { socket } from "@/lib/socketio";
import { queryKeys } from "@/data/query-keys";
import type { Cart } from "@/data/types/cart";
import type { NFT } from "@/data/types/nft";
import type { Order } from "@/data/schemas/orders";
import { nftUpdatedSchema, orderUpdatedSchema } from "@/data/schemas/realtime";
import { reconcileResources } from "./reconcile";

const cachedNFTVersion = (
  client: QueryClient,
  nftId: string,
  ownerId?: string,
) => {
  let version = 0;

  const resources = [
    ...client.getQueriesData<NFT | { items: NFT[] }>({
      queryKey: queryKeys.nfts.all,
    }),
    ...(ownerId
      ? client.getQueriesData<{ items: NFT[] }>({
          queryKey: queryKeys.favorites.list(ownerId),
        })
      : []),
  ];

  for (const [, data] of resources) {
    if (!data) continue;
    const nft =
      "items" in data
        ? data.items.find((item) => item.id === nftId)
        : data.id === nftId
          ? data
          : undefined;
    version = Math.max(version, nft?.version ?? 0);
  }

  const item = client
    .getQueryData<Cart>(queryKeys.cart.current(ownerId))
    ?.items.find((item) => item.nftId === nftId);

  return Math.max(version, item?.version ?? 0);
};

export const registerResourceEvents = (
  client: QueryClient,
  ownerId: string | undefined,
  active: () => boolean,
) => {
  const versions = new Map<string, number>();

  const onNFTUpdated = (payload: unknown) => {
    const result = nftUpdatedSchema.safeParse(payload);
    if (!result.success || !active()) return;
    const event = result.data;
    const key = `nft:${event.nftId}`;
    const version = Math.max(
      versions.get(key) ?? 0,
      cachedNFTVersion(client, event.nftId, ownerId),
    );
    if (event.version <= version) return;

    versions.set(key, event.version);

    const cart = client.getQueryData<Cart>(queryKeys.cart.current(ownerId));
    if (
      event.reason === "market" &&
      cart?.items.some((item) => item.nftId === event.nftId)
    )
      toast.info(
        "O preço ou a disponibilidade de um NFT mudou. Revise os valores antes de confirmar.",
      );

    void reconcileResources(client, ownerId, active, event.nftId);
  };

  const onOrderUpdated = (payload: unknown) => {
    const result = orderUpdatedSchema.safeParse(payload);
    if (
      !result.success ||
      !active() ||
      !ownerId ||
      result.data.userId !== ownerId
    )
      return;

    const event = result.data;
    const key = `order:${event.orderId}`;
    const queryKey = queryKeys.orders.attempt(ownerId, event.attemptKey);
    const current = client.getQueryData<Order>(queryKey);
    if (
      current &&
      current.status !== "pending" &&
      current.status !== event.status
    )
      return;
    if (
      event.version <= Math.max(versions.get(key) ?? 0, current?.version ?? 0)
    )
      return;

    versions.set(key, event.version);
    void client.invalidateQueries({ queryKey });
  };

  socket.on("nft.updated", onNFTUpdated);
  socket.on("order.updated", onOrderUpdated);

  return () => {
    socket.off("nft.updated", onNFTUpdated);
    socket.off("order.updated", onOrderUpdated);
  };
};

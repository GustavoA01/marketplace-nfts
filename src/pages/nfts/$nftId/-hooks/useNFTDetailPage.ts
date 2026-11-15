import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { queryKeys } from "@/data/query-keys";
import type { AddCartItemPayload } from "@/data/types/cart";
import { useSession } from "@/features/Auth/hooks/useSession";
import {
  cartErrorMessage,
  commitCartCache,
  isCartOwnerActive,
} from "@/lib/cart-query";
import { addCartItem } from "@/services/cart/add";
import { getNFT } from "@/services/nfts/detail";
import { getNFTs } from "@/services/nfts/list";

export const useNFTDetailPage = (nftId: string) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { data: user } = useSession();

  const [selections, setSelections] = useState<
    Record<string, { edition: string; quantity: number }>
  >({});

  const {
    mutate: addItem,
    isPending: isAdding,
    error: addError,
    variables: addition,
  } = useMutation({
    mutationKey: queryKeys.cart.add,
    mutationFn: ({
      payload,
    }: {
      payload: AddCartItemPayload;
      openCart: boolean;
      ownerId?: string;
    }) => addCartItem(payload),
    retry: false,
    onSuccess: (cart, { ownerId, openCart }) => {
      if (!isCartOwnerActive(client, ownerId)) return;
      commitCartCache(client, cart, ownerId);
      toast.success("NFT adicionado ao carrinho.");
      if (openCart) void navigate({ to: "/carrinho" });
    },
    onError: (error, { ownerId }) => {
      if (isCartOwnerActive(client, ownerId))
        toast.error(cartErrorMessage(error));
    },
  });

  const {
    data: nft,
    isPending,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.nfts.detail(nftId),
    queryFn: ({ signal }) => getNFT(nftId, signal),
    retry: (attempt, queryError) =>
      !(isAxiosError(queryError) && queryError.response?.status === 404) &&
      attempt < 1,
  });

  const relatedSearch = { q: nft?.collection };
  const related = useQuery({
    queryKey: queryKeys.nfts.list(relatedSearch),
    queryFn: ({ signal }) => getNFTs(relatedSearch, signal),
    enabled: Boolean(nft),
  });

  const preferredEdition = selections[nftId]?.edition ?? nft?.defaultEdition;
  const selectedEdition =
    nft && preferredEdition && nft.editionAvailability[preferredEdition] > 0
      ? preferredEdition
      : (nft?.editions.find(
          (edition) => nft.editionAvailability[edition] > 0,
        ) ?? "");
  const maxQuantity = nft?.editionAvailability[selectedEdition] ?? 0;
  const quantity = Math.max(
    1,
    Math.min(selections[nftId]?.quantity ?? 1, Math.max(maxQuantity, 1)),
  );

  const onSelectionChange = (
    patch: Partial<{ edition: string; quantity: number }>,
  ) => {
    setSelections((previous) => ({
      ...previous,
      [nftId]: { edition: selectedEdition, quantity, ...patch },
    }));
  };

  const onAddToCart = (openCart: boolean) => {
    if (
      !selectedEdition ||
      quantity > maxQuantity ||
      isAdding ||
      isFetching ||
      user === undefined
    )
      return;
    addItem({
      payload: { nftId, edition: selectedEdition, quantity },
      openCart,
      ownerId: user?.id,
    });
  };

  const recommendations =
    related.data?.items.filter((item) => item.id !== nftId).slice(0, 5) ?? [];

  return {
    nft,
    isPending,
    isError,
    isFetching,
    error,
    refetch,
    related,
    recommendations,
    selectedEdition,
    quantity,
    maxQuantity,
    isAdding,
    addError,
    addition,
    disabled: isAdding || isFetching || user === undefined,
    onBuy: () => onAddToCart(true),
    onAddToCart: () => onAddToCart(false),
    onEditionChange: (edition: string) => onSelectionChange({ edition }),
    onQuantityChange: (value: number) =>
      onSelectionChange({
        quantity: Math.max(1, Math.min(value, maxQuantity)),
      }),
  };
};

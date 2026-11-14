import { toast } from "sonner";
import type { AddCartItemPayload } from "@/data/types/cart";
import { addCartItem } from "@/services/cart/add";
import {
  cartErrorMessage,
  commitCartCache,
  isCartOwnerActive,
} from "@/lib/cart-query";
import { useSession } from "@/features/Auth/hooks/useSession";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { NFTRecommendations } from "@/components/NFTRecommendations";
import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import { queryKeys } from "@/data/query-keys";
import { getNFT } from "@/services/nfts/detail";
import { getNFTs } from "@/services/nfts/list";
import { NFTGallery } from "./-components/NFTGallery";
import { NFTInformation } from "./-components/NFTInformation";
import { NFTDescription } from "./-components/NFTDescription";
import { NFTDetailSkeleton } from "./-components/NFTDetailSkeleton";

const Page = () => {
  const { nftId } = Route.useParams();
  const client = useQueryClient();
  const navigate = useNavigate();
  const { data: user } = useSession();
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
  const [selections, setSelections] = useState<
    Record<string, { edition: string; quantity: number }>
  >({});
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
    retry: (attempt, error) =>
      !(isAxiosError(error) && error.response?.status === 404) && attempt < 1,
  });
  const relatedSearch = { q: nft?.collection };
  const related = useQuery({
    queryKey: queryKeys.nfts.list(relatedSearch),
    queryFn: ({ signal }) => getNFTs(relatedSearch, signal),
    enabled: Boolean(nft),
  });
  if (isPending) return <NFTDetailSkeleton />;
  if (isError || !nft) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="space-y-5 p-6" role="alert">
        <h1 className="text-2xl font-bold">
          {notFound
            ? "NFT não encontrado"
            : "Não foi possível carregar este NFT"}
        </h1>
        {!notFound && (
          <Button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            Tentar novamente
          </Button>
        )}
        <Link to="/" hash="catalogo" className="block text-primary underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }
  const preferredEdition = selections[nftId]?.edition ?? nft.defaultEdition;
  const selectedEdition =
    nft.editionAvailability[preferredEdition] > 0
      ? preferredEdition
      : (nft.editions.find((edition) => nft.editionAvailability[edition] > 0) ??
        "");
  const maxQuantity = nft.editionAvailability[selectedEdition] ?? 0;
  const quantity = Math.max(
    1,
    Math.min(selections[nftId]?.quantity ?? 1, maxQuantity),
  );
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
  const onSelectionChange = (
    patch: Partial<{ edition: string; quantity: number }>,
  ) => {
    setSelections((previous) => ({
      ...previous,
      [nftId]: { edition: selectedEdition, quantity, ...patch },
    }));
  };
  const recommendations =
    related.data?.items.filter((item) => item.id !== nftId).slice(0, 5) ?? [];
  return (
    <div className="mb-16 lg:mb-24" aria-busy={isFetching}>
      <div className="hidden lg:block">
        <PurchaseBreadcrumb compact mobileTitle="Detalhes do NFT" />
      </div>
      {isFetching && (
        <p role="status" className="sr-only">
          Atualizando NFT
        </p>
      )}
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <NFTGallery key={nftId} gallery={nft.gallery} name={nft.name} />
        <NFTInformation
          nft={nft}
          maxQuantity={maxQuantity}
          isAdding={isAdding}
          disabled={isAdding || isFetching || user === undefined}
          onBuy={() => onAddToCart(true)}
          onAddToCart={() => onAddToCart(false)}
          selectedEdition={selectedEdition}
          quantity={quantity}
          onEditionChange={(edition) => onSelectionChange({ edition })}
          onQuantityChange={(value) =>
            onSelectionChange({
              quantity: Math.max(1, Math.min(value, maxQuantity)),
            })
          }
        />
      </div>
      {addError && addition?.payload.nftId === nftId && (
        <p role="alert" className="mt-4 px-6 text-sm text-error lg:px-0">
          {cartErrorMessage(addError)}
        </p>
      )}
      <NFTDescription nft={nft} />
      <div className="px-6 lg:px-0">
        {related.isError ? (
          <div role="alert" className="mt-12 space-y-3">
            <p>Não foi possível carregar outros NFTs desta coleção.</p>
            <Button variant="outline" onClick={() => void related.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          recommendations.length > 0 && (
            <NFTRecommendations
              title="Mais desta coleção"
              items={recommendations}
            />
          )
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/nfts/$nftId/")({ component: Page });

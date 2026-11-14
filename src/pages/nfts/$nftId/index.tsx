import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  const [selections, setSelections] = useState<
    Record<string, { edition: string; quantity: number }>
  >({});
  const query = useQuery({
    queryKey: queryKeys.nfts.detail(nftId),
    queryFn: ({ signal }) => getNFT(nftId, signal),
    retry: (attempt, error) =>
      !(isAxiosError(error) && error.response?.status === 404) && attempt < 1,
  });
  const nft = query.data;
  const relatedSearch = { q: nft?.collection };
  const related = useQuery({
    queryKey: queryKeys.nfts.list(relatedSearch),
    queryFn: ({ signal }) => getNFTs(relatedSearch, signal),
    enabled: Boolean(nft),
  });
  if (query.isPending) return <NFTDetailSkeleton />;
  if (query.isError) {
    const notFound =
      isAxiosError(query.error) && query.error.response?.status === 404;
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
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
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
  const selectedEdition =
    selections[nftId]?.edition ?? query.data.defaultEdition ?? "";
  const quantity = Math.max(
    1,
    Math.min(selections[nftId]?.quantity ?? 1, query.data.availableQuantity),
  );
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
    <div className="mb-16 lg:mb-24" aria-busy={query.isFetching}>
      <div className="hidden lg:block">
        <PurchaseBreadcrumb compact mobileTitle="Detalhes do NFT" />
      </div>
      {query.isFetching && (
        <p role="status" className="sr-only">
          Atualizando NFT
        </p>
      )}
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <NFTGallery
          key={nftId}
          gallery={query.data.gallery}
          name={query.data.name}
        />
        <NFTInformation
          nft={query.data}
          selectedEdition={selectedEdition}
          quantity={quantity}
          onEditionChange={(edition) => onSelectionChange({ edition })}
          onQuantityChange={(value) =>
            onSelectionChange({
              quantity: Math.max(
                1,
                Math.min(value, query.data.availableQuantity),
              ),
            })
          }
        />
      </div>
      <NFTDescription nft={query.data} />
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

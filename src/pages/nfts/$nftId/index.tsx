import { createFileRoute, Link } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { NFTRecommendations } from "@/components/NFTRecommendations";
import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import { cartErrorMessage } from "@/lib/cart-query";
import { NFTGallery } from "./-components/NFTGallery";
import { NFTInformation } from "./-components/NFTInformation";
import { NFTDescription } from "./-components/NFTDescription";
import { NFTDetailSkeleton } from "./-components/NFTDetailSkeleton";
import { useNFTDetailPage } from "./-hooks/useNFTDetailPage";

const Page = () => {
  const { nftId } = Route.useParams();
  const {
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
    disabled,
    onBuy,
    onAddToCart,
    onEditionChange,
    onQuantityChange,
  } = useNFTDetailPage(nftId);

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
        <NFTGallery
          key={nftId}
          nftId={nftId}
          gallery={nft.gallery}
          name={nft.name}
        />
        <NFTInformation
          nft={nft}
          maxQuantity={maxQuantity}
          isAdding={isAdding}
          disabled={disabled}
          onBuy={onBuy}
          onAddToCart={onAddToCart}
          selectedEdition={selectedEdition}
          quantity={quantity}
          onEditionChange={onEditionChange}
          onQuantityChange={onQuantityChange}
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

import { quoteQueryOptions } from "@/lib/quote-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import { NFTRecommendations } from "@/components/NFTRecommendations";
import { queryKeys } from "@/data/query-keys";
import { useSession } from "@/features/Auth/hooks/useSession";
import { cartErrorMessage, cartQueryOptions } from "@/lib/cart-query";
import { getNFTs } from "@/services/nfts/list";
import { CartItems } from "./-components/CartItems";
import { OrderSummary } from "./-components/OrderSummary";
import { CartSkeleton } from "./-components/CartSkeleton";
import { useCartMutations } from "./-hooks/useCartMutations";

const Page = () => {
  const client = useQueryClient();
  const {
    data: user,
    isError: sessionError,
    refetch: refetchSession,
  } = useSession();
  const {
    data: cart,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({ ...cartQueryOptions(user?.id), enabled: user !== undefined });
  const {
    applyCoupon,
    removeCoupon,
    couponError,
    updateQuantity,
    removeItem,
    isPending: isSaving,
    error,
  } = useCartMutations(user?.id);
  const hasUnavailableItems =
    cart?.items.some((item) => !item.isAvailable) ?? false;
  const quoteEnabled = Boolean(
    cart?.items.length &&
    !hasUnavailableItems &&
    !isSaving &&
    !isFetching &&
    user !== undefined,
  );
  const {
    data: quote,
    isPending: isQuotePending,
    isFetching: isQuoteFetching,
    isError: quoteFailed,
    error: quoteError,
    refetch: refetchQuote,
  } = useQuery({
    ...quoteQueryOptions(cart, client, user?.id),
    enabled: quoteEnabled,
  });
  const { data: recommendations } = useQuery({
    queryKey: queryKeys.nfts.list({ tab: "trending" }),
    queryFn: ({ signal }) => getNFTs({ tab: "trending" }, signal),
  });
  const relatedItems =
    recommendations?.items
      .filter((item) => !cart?.items.some((entry) => entry.nftId === item.id))
      .slice(0, 5) ?? [];
  return (
    <div className="mb-16 pt-8 lg:mb-24 lg:pt-0">
      <div className="px-7 lg:px-0">
        <PurchaseBreadcrumb
          compact
          title="Carrinho"
          mobileTitle="Carrinho de NFTs"
        />
      </div>
      {sessionError || isError ? (
        <div role="alert" className="space-y-4 px-7 py-8 lg:px-0">
          <p>Não foi possível carregar o carrinho.</p>
          <Button
            type="button"
            onClick={() => void (sessionError ? refetchSession() : refetch())}
            disabled={isFetching}
          >
            Tentar novamente
          </Button>
        </div>
      ) : isPending ? (
        <CartSkeleton />
      ) : !cart.items.length ? (
        <div className="space-y-5 px-7 py-10 text-center lg:px-0">
          <h2 className="text-xl font-bold">Seu carrinho está vazio</h2>
          <p role="status" className="text-text-secondary">
            Explore o catálogo e escolha seu próximo NFT.
          </p>
          <Button nativeButton={false} render={<Link to="/" hash="catalogo" />}>
            Explorar NFTs
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-start xl:gap-12"
          aria-busy={isSaving || isFetching}
        >
          <div className="min-w-0 flex-1 px-7 lg:px-0">
            <CartItems
              items={cart.items}
              disabled={isSaving || isFetching}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          </div>
          <aside className="w-full shrink-0 xl:w-83">
            <OrderSummary
              subtotal={cart.subtotal}
              couponCode={cart.couponCode}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              couponError={
                couponError ? cartErrorMessage(couponError) : undefined
              }
              quote={quote}
              isQuotePending={quoteEnabled && isQuotePending}
              isQuoteFetching={isQuoteFetching}
              quoteError={
                hasUnavailableItems
                  ? "Ajuste os itens indisponíveis para calcular a compra."
                  : quoteFailed
                    ? cartErrorMessage(quoteError)
                    : undefined
              }
              onRetryQuote={
                quoteFailed && !hasUnavailableItems
                  ? () => void refetchQuote()
                  : undefined
              }
              isBusy={isSaving || isFetching}
            />
          </aside>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 px-7 text-sm text-error lg:px-0">
          {cartErrorMessage(error)}
        </p>
      )}
      <p
        role="status"
        className="mt-4 min-h-5 px-7 text-sm text-text-secondary lg:px-0"
      >
        {isSaving ? "Atualizando carrinho..." : ""}
      </p>

      <div className="px-6 lg:px-0">
        {relatedItems.length > 0 && (
          <NFTRecommendations
            title="Colecionadores também viram"
            items={relatedItems}
          />
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/carrinho/")({ component: Page });

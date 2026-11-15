import { queryKeys } from "@/data/query-keys";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useIsMutating, useQuery } from "@tanstack/react-query";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSession } from "@/features/Auth/hooks/useSession";
import { requireSession } from "@/features/Auth/utils/navigation";
import { favoritesQueryOptions } from "@/lib/favorites-query";

const Page = () => {
  const { data: user } = useSession();
  const isSaving =
    useIsMutating({ mutationKey: queryKeys.favorites.change(user?.id) }) > 0;
  const { data, isPending, isError, isFetching, refetch } = useQuery(
    favoritesQueryOptions(user?.id),
  );
  const items =
    data?.items.filter((item) => data.nftIds.includes(item.id)) ?? [];
  return (
    <>
      <AccountMobileBar title="Favoritos" />
      <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
        <AccountSidebar active="favorites" />
        <section className="min-w-0 flex-1" aria-busy={isFetching}>
          <h1 className="mb-6 text-2xl font-bold">Meus favoritos</h1>
          {isSaving && (
            <p role="status" className="mb-4 text-sm text-text-secondary">
              Salvando favoritos...
            </p>
          )}
          {isPending ? (
            <div
              role="status"
              className="grid grid-cols-2 gap-5 lg:grid-cols-3"
            >
              <span className="sr-only">Carregando favoritos</span>
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-75 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div role="alert" className="space-y-4">
              <p>Não foi possível carregar os favoritos.</p>
              <Button disabled={isFetching} onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : !items.length ? (
            <div role="status" className="space-y-4 py-8">
              <p>Você ainda não tem NFTs favoritos.</p>
              <Button
                nativeButton={false}
                render={<Link to="/" hash="catalogo" />}
              >
                Explorar NFTs
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-3">
              {items.map((nft) => (
                <NFTCard key={nft.id} nft={nft} showFavorite />
              ))}
            </div>
          )}
        </section>
      </div>
      <MobileBottomNavigation />
    </>
  );
};

export const Route = createFileRoute("/favoritos/")({
  beforeLoad: requireSession,
  component: Page,
});

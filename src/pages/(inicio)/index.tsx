import { createFileRoute } from "@tanstack/react-router";
import { normalizeCatalogueSearch } from "@/data/schemas/catalogue";
import type { CatalogueSearch } from "@/data/types/catalogue";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { DeskHero } from "./-components/DeskHero";
import { Catalogue } from "./-components/Catalogue";
import { HomePromos } from "./-components/HomePromos";
import { Journal } from "./-components/Journal";
import { MobileHero } from "./-components/MobileHero";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/data/query-keys";
import { getNFTs } from "@/services/nfts/list";

const Page = () => {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isPending, isPlaceholderData, isError, isFetching, refetch } =
    useQuery({
      placeholderData: keepPreviousData,
      queryKey: queryKeys.nfts.list(search),
      queryFn: ({ signal }) => getNFTs(search, signal),
    });

  const onChange = (patch: Partial<CatalogueSearch>) => {
    void navigate({
      search: (previous: CatalogueSearch) =>
        normalizeCatalogueSearch({
          ...previous,
          ...patch,
          page: patch.page ?? 1,
        }),
      resetScroll: false,
    });
  };

  const controls = {
    collections: data?.filters.categories ?? [],
    networks: data?.filters.networks ?? [],
    search,
    onChange,
  };

  return (
    <>
      <div className="hidden lg:block">
        <DeskHero />
      </div>
      <MobileHero {...controls} />
      <Catalogue
        {...controls}
        data={data}
        isPending={isPending}
        isPlaceholderData={isPlaceholderData}
        isError={isError}
        isFetching={isFetching}
        onRetry={() => void refetch()}
      />
      <HomePromos />
      <Journal />
      <MobileBottomNavigation />
    </>
  );
};

export const Route = createFileRoute("/(inicio)/")({
  validateSearch: normalizeCatalogueSearch,
  component: Page,
});

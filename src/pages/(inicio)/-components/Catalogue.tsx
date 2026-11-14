import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/Button";
import type { NFTListResponse } from "@/data/types/catalogue";
import {
  CatalogueFilters,
  type CatalogueFiltersProps,
} from "./CatalogueFilters";
import { CataloguePagination } from "./CataloguePagination";
import { CatalogueSkeleton } from "./CatalogueSkeleton";
import { CatalogueToolbar } from "./CatalogueToolbar";
import { FeaturedNFT } from "./FeaturedNFT";

const artworkLayouts = [
  "lg:pt-[31px]",
  "lg:pt-[25px]",
  "",
  "",
  "",
  "",
  "lg:pt-5",
  "lg:pt-7",
  "lg:pt-5",
];

type CatalogueProps = CatalogueFiltersProps & {
  data?: NFTListResponse;
  isPending: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
};

export const Catalogue = ({
  data,
  isPending,
  isPlaceholderData,
  isError,
  isFetching,
  onRetry,
  ...props
}: CatalogueProps) => {
  const { search, onChange } = props;
  const featured = data?.items[1];

  return (
    <section
      id="catalogo"
      className="mt-4 mb-24 scroll-mt-6 lg:mt-12 xl:mt-24"
      aria-busy={isFetching}
    >
      <h2 className="sr-only">Catálogo de NFTs</h2>
      <div className="flex items-start gap-12">
        <aside className="hidden w-[310px] shrink-0 flex-col gap-6 xl:flex">
          <CatalogueFilters {...props} />
          {featured && (
            <FeaturedNFT
              image={featured.image}
              description={featured.imageDescription}
            />
          )}
        </aside>
        <div className="min-w-0 flex-1">
          <CatalogueToolbar {...props} />
          {search.q && (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <p>
                Busca: <strong>{search.q}</strong>
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange({ q: undefined })}
              >
                Limpar busca
              </Button>
            </div>
          )}
          {isPending || isPlaceholderData ? (
            <CatalogueSkeleton />
          ) : isError || !data ? (
            <div
              role="alert"
              className="mt-8 space-y-4 rounded-lg border border-border p-6"
            >
              <p>Não foi possível carregar os NFTs. Tente novamente.</p>
              <Button type="button" onClick={onRetry} disabled={isFetching}>
                Tentar novamente
              </Button>
            </div>
          ) : !data.items.length ? (
            <div
              role="status"
              className="mt-8 space-y-4 rounded-lg border border-border p-6"
            >
              <p>
                {data.total
                  ? "Não há NFTs nesta página."
                  : "Nenhum NFT encontrado para esta busca."}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onChange({
                    q: undefined,
                    category: undefined,
                    network: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    tab: undefined,
                  })
                }
              >
                Ver todos os NFTs
              </Button>
            </div>
          ) : (
            <>
              <p role="status" className="sr-only">
                {isFetching
                  ? "Atualizando NFTs"
                  : `${data.total} NFTs encontrados`}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 pb-8 md:grid-cols-3 md:pb-0 lg:gap-x-[34px] lg:gap-y-[72px]">
                {data.items.map((nft, index) => (
                  <div
                    key={nft.id}
                    className="min-w-0 even:translate-y-8 md:even:translate-y-0"
                  >
                    <NFTCard
                      nft={nft}
                      artworkClassName={artworkLayouts[index]}
                      detailsClassName={index < 3 ? "lg:gap-3" : undefined}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-12 lg:mt-[88px]">
                <CataloguePagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onChange={(page) => onChange({ page })}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

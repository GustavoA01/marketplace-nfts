import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { CatalogueFiltersContainer } from "@/features/CatalogueFilters/container/CatalogueFiltersContainer";
import { catalogueMocks } from "@/mocks/catalogue";
import { CataloguePagination } from "./CataloguePagination";
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

export const Catalogue = () => {
  return (
    <section className="mt-12 mb-24 xl:mt-24">
      <h2 className="sr-only">Catálogo de NFTs</h2>
      <div className="mb-6 xl:hidden">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Filtros</Button>} />
          <DialogContent
            showCloseButton={false}
            className="max-h-[85svh] overflow-y-auto rounded-none"
          >
            <div className="flex items-center justify-between p-5 pb-0">
              <DialogTitle>Filtros do catálogo</DialogTitle>
              <DialogClose render={<Button variant="ghost">Fechar</Button>} />
            </div>
            <CatalogueFiltersContainer />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-start gap-12">
        <aside className="hidden w-[310px] shrink-0 flex-col gap-6 xl:flex">
          <CatalogueFiltersContainer />
          <FeaturedNFT image={catalogueMocks[1].image} />
        </aside>

        <div className="min-w-0 flex-1">
          <CatalogueToolbar />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 pb-8 md:grid-cols-3 md:pb-0 lg:gap-x-[34px] lg:gap-y-[72px]">
            {catalogueMocks.map((nft, index) => (
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
            <CataloguePagination />
          </div>
        </div>
      </div>
    </section>
  );
};

import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CatalogueFiltersDialog } from "./CatalogueFiltersDialog";
import {
  collectionMocks,
  networkMocks,
} from "@/mocks/temporary/catalogue-filters";

export const MobileHero = () => {
  return (
    <div className="lg:hidden">
      <div className="mb-4 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute top-3 left-3 size-[22px] text-secondary" />
          <Input
            id="mobile-home-search"
            placeholder="Explorar coleções"
            className="h-[45px] rounded-[10px] border-0 bg-surface-card pr-3 pl-[42px] text-sm font-bold placeholder:text-secondary dark:bg-surface-card"
          />
          <label htmlFor="mobile-home-search" className="sr-only">
            Explorar coleções
          </label>
        </div>
        <CatalogueFiltersDialog
          collections={collectionMocks}
          networks={networkMocks}
          trigger={
            <Button
              type="button"
              size="icon"
              className="size-[45px] rounded-[14px] bg-linear-to-br from-primary/45 to-primary"
            >
              <SlidersHorizontal className="size-[22px]" />
              <span className="sr-only">Filtros</span>
            </Button>
          }
        />
      </div>
      <section className="relative overflow-hidden rounded-xl bg-surface-dark bg-[url('/mocks/MobileHeroBackground.svg')] bg-cover bg-center px-4 pt-3 pb-2">
        <div className="relative flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs leading-4 font-medium">Bem-vindo à Kurio</p>
            <h1 className="mt-1.5 text-[18px] leading-[29px] font-bold">
              SEJA DONO DA
              <br />
              CULTURA DIGITAL
            </h1>
            <p className="mt-1.5 max-w-[188px] text-xs leading-[18px] text-text-secondary">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>
            <Link
              to="/"
              hash="catalogo"
              className="mt-1 inline-flex items-center gap-2 text-xs leading-[14px] font-bold text-text-accent"
            >
              EXPLORAR
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative w-[118px] shrink-0 sm:w-[138px]">
            <img
              src="/mocks/MobileHomeEmerald.png"
              alt="Emerald Ape em destaque"
              width={138}
              height={138}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <img
              src="/mocks/MobileHomeSage.png"
              alt="Sage Nomad em destaque"
              width={58}
              height={58}
              className="absolute bottom-[-8px] left-[14px] size-[58px] rounded-2xl object-cover"
            />
          </div>
        </div>
        <img
          src="/icons/MobileHeroDots.svg"
          alt=""
          className="relative mx-auto mt-3"
        />
      </section>
    </div>
  );
};

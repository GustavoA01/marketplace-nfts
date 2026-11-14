import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { CatalogueFiltersDialog } from "./CatalogueFiltersDialog";
import type { CatalogueFiltersProps } from "./CatalogueFilters";

const tabs = [
  { value: "all", label: "Todos os NFTs" },
  { value: "new", label: "Novos lançamentos" },
  { value: "trending", label: "Em alta" },
] as const;

const sortOptions = [
  { value: "recent", label: "Listados recentemente" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

export const CatalogueToolbar = (props: CatalogueFiltersProps) => {
  const { search, onChange } = props;
  return (
    <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-x-4">
      <div className="-mx-1 flex gap-6 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <Button
            type="button"
            variant="ghost"
            key={tab.value}
            aria-pressed={(search.tab ?? "all") === tab.value}
            onClick={() => onChange({ tab: tab.value })}
            className={cn(
              "relative h-auto shrink-0 rounded-none px-1.5 pt-2 pb-2.5 text-[15px] leading-4 font-medium hover:bg-transparent",
              (search.tab ?? "all") === tab.value && "text-text-accent",
            )}
          >
            {tab.label}
            {(search.tab ?? "all") === tab.value && (
              <span className="absolute right-1 bottom-0 left-1 h-0.5 bg-primary" />
            )}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[15px] leading-4.5">
        <span>Ordenar por:</span>
        <Select
          value={search.sort ?? "recent"}
          items={sortOptions}
          onValueChange={(value) => {
            if (
              value === "recent" ||
              value === "price-asc" ||
              value === "price-desc"
            )
              onChange({ sort: value });
          }}
        >
          <SelectTrigger className="h-auto max-w-53.75 gap-1 rounded-none border-0 bg-transparent p-0 text-[15px] shadow-none dark:bg-transparent dark:hover:bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto hidden lg:block xl:hidden">
          <CatalogueFiltersDialog
            {...props}
            trigger={
              <Button type="button" variant="ghost" size="icon">
                <SlidersHorizontal className="size-5" />
                <span className="sr-only">Filtros</span>
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CatalogueOption, CatalogueSearch } from "@/data/types/catalogue";
import { FilterOptions } from "./FilterOptions";
import { PriceFilter } from "./PriceFilter";

export type CatalogueFiltersProps = {
  collections: CatalogueOption[];
  networks: CatalogueOption[];
  search: CatalogueSearch;
  onChange: (patch: Partial<CatalogueSearch>) => void;
};

export const CatalogueFilters = ({
  collections,
  networks,
  search,
  onChange,
}: CatalogueFiltersProps) => {
  const toggle = (key: "category" | "network", value: string) => {
    const values = search[key] ?? [];
    onChange({
      [key]: values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    });
  };
  const hasFilters =
    search.category?.length ||
    search.network?.length ||
    search.minPrice !== undefined ||
    search.maxPrice !== undefined;
  return (
    <Card className="min-h-196.25 gap-10 rounded-none p-5 ring-0">
      <FilterOptions
        title="Coleções"
        options={collections}
        selected={search.category ?? []}
        onToggle={(name) => toggle("category", name)}
      />
      <PriceFilter
        key={`${search.minPrice}-${search.maxPrice}`}
        minPrice={search.minPrice}
        maxPrice={search.maxPrice}
        onApply={([minPrice, maxPrice]) => onChange({ minPrice, maxPrice })}
      />
      <FilterOptions
        title="Rede"
        options={networks}
        selected={search.network ?? []}
        onToggle={(name) => toggle("network", name)}
      />
      {Boolean(hasFilters) && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onChange({
              category: undefined,
              network: undefined,
              minPrice: undefined,
              maxPrice: undefined,
            })
          }
        >
          Limpar filtros
        </Button>
      )}
    </Card>
  );
};

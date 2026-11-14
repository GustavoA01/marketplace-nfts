import { Card } from "@/components/ui/Card";
import { FilterOptions, type FilterOption } from "./FilterOptions";
import { PriceFilter } from "./PriceFilter";

type CatalogueFiltersProps = {
  collections: FilterOption[];
  networks: FilterOption[];
};

export const CatalogueFilters = ({
  collections,
  networks,
}: CatalogueFiltersProps) => {
  return (
    <Card className="min-h-196.25 gap-10 rounded-none p-5 ring-0">
      <FilterOptions title="Coleções" options={collections} />
      <PriceFilter />
      <FilterOptions title="Rede" options={networks} />
    </Card>
  );
};

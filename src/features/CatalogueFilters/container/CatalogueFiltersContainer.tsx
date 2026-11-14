import { CatalogueFilters } from "../components/CatalogueFilters";
import { collectionMocks, networkMocks } from "@/mocks/catalogue-filters";

export const CatalogueFiltersContainer = () => {
  return (
    <CatalogueFilters collections={collectionMocks} networks={networkMocks} />
  );
};

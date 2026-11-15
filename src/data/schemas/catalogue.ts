import { z } from "zod";
import type { CatalogueSearch } from "@/data/types/catalogue";

const filterValues = z.array(z.string().trim().min(1).max(80)).max(20);
const price = z.coerce.number().min(0).max(1_000_000);

export const catalogueSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: filterValues.optional(),
  network: filterValues.optional(),
  minPrice: price.optional(),
  maxPrice: price.optional(),
  sort: z.enum(["recent", "price-asc", "price-desc"]).optional(),
  tab: z.enum(["all", "new", "trending"]).optional(),
  page: z.coerce.number().int().min(1).max(100_000).optional(),
});

export const normalizeCatalogueSearch = (
  input: Record<string, unknown>,
): CatalogueSearch => {
  const search: Record<string, unknown> = {};

  for (const [key, schema] of Object.entries(catalogueSearchSchema.shape)) {
    let value = input[key];
    if (
      (key === "category" || key === "network") &&
      typeof value === "string"
    ) {
      value = [value];
    }
    const result = schema.safeParse(value);
    if (result.success && result.data !== undefined) search[key] = result.data;
  }

  const result = search as CatalogueSearch;

  if (!result.q) delete result.q;
  if (result.category)
    result.category = Array.from(new Set(result.category)).sort();
  if (result.network)
    result.network = Array.from(new Set(result.network)).sort();

  if (!result.category?.length) delete result.category;
  if (!result.network?.length) delete result.network;
  if (result.sort === "recent") delete result.sort;
  if (result.tab === "all") delete result.tab;
  if (result.page === 1) delete result.page;

  if (
    result.minPrice !== undefined &&
    result.maxPrice !== undefined &&
    result.minPrice > result.maxPrice
  ) {
    [result.minPrice, result.maxPrice] = [result.maxPrice, result.minPrice];
  }

  return result;
};

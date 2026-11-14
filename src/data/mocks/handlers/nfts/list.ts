import { HttpResponse, type HttpResponseResolver } from "msw/http";
import { catalogueSearchSchema } from "@/data/schemas/catalogue";
import type { CatalogueOption, NFTListResponse } from "@/data/types/catalogue";
import { nfts } from "../../fixtures/nfts";
import { simulateCatalogueRequest } from "../../scenarios/catalogue";

const pageSize = 9;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const countOptions = (field: "category" | "network"): CatalogueOption[] => {
  const counts = new Map<string, number>();
  for (const nft of nfts)
    counts.set(nft[field], (counts.get(nft[field]) ?? 0) + 1);
  return Array.from(counts, ([name, count]) => ({ name, count }));
};

export const listNFTsHandler: HttpResponseResolver = async ({ request }) => {
  const scenario = await simulateCatalogueRequest(request);
  if (scenario instanceof Response) return scenario;
  const params = new URL(request.url).searchParams;
  const result = catalogueSearchSchema.safeParse({
    q: params.get("q") ?? undefined,
    category: params.getAll("category"),
    network: params.getAll("network"),
    minPrice: params.get("minPrice") ?? undefined,
    maxPrice: params.get("maxPrice") ?? undefined,
    sort: params.get("sort") ?? undefined,
    tab: params.get("tab") ?? undefined,
    page: params.get("page") ?? undefined,
  });
  if (
    !result.success ||
    (result.data.minPrice !== undefined &&
      result.data.maxPrice !== undefined &&
      result.data.minPrice > result.data.maxPrice)
  ) {
    return HttpResponse.json(
      { message: "Parâmetros de busca inválidos." },
      { status: 400 },
    );
  }
  const search = result.data;
  const query = normalizeText(search.q ?? "");
  const latest = nfts.reduce(
    (date, nft) => Math.max(date, Date.parse(nft.createdAt)),
    0,
  );
  const items =
    scenario === "empty"
      ? []
      : nfts.filter((nft) => {
          const price = Number(nft.price);
          const matchesQuery = normalizeText(
            `${nft.name} ${nft.collection} ${nft.creator}`,
          ).includes(query);
          return (
            matchesQuery &&
            (!search.category?.length ||
              search.category.includes(nft.category)) &&
            (!search.network?.length || search.network.includes(nft.network)) &&
            (search.minPrice === undefined || price >= search.minPrice) &&
            (search.maxPrice === undefined || price <= search.maxPrice) &&
            (search.tab !== "trending" || nft.trending) &&
            (search.tab !== "new" ||
              Date.parse(nft.createdAt) >= latest - 30 * 86_400_000)
          );
        });
  items.sort((first, second) => {
    const difference =
      search.sort === "price-asc"
        ? Number(first.price) - Number(second.price)
        : search.sort === "price-desc"
          ? Number(second.price) - Number(first.price)
          : Date.parse(second.createdAt) - Date.parse(first.createdAt);
    return difference || first.id.localeCompare(second.id);
  });
  const page = search.page ?? 1;
  return HttpResponse.json<NFTListResponse>({
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
    filters: {
      categories: countOptions("category"),
      networks: countOptions("network"),
    },
  });
};

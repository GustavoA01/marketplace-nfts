import type { NFT } from "./nft";

export type CatalogueSearch = {
  q?: string;
  category?: string[];
  network?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "recent" | "price-asc" | "price-desc";
  tab?: "all" | "new" | "trending";
  page?: number;
};

export type CatalogueOption = { name: string; count: number };

export type NFTListResponse = {
  items: NFT[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: {
    categories: CatalogueOption[];
    networks: CatalogueOption[];
  };
};

export type NFTDetail = NFT & {
  defaultEdition: string;
  gallery: { image: string; mobileImage: string; description: string }[];
  token: string;
  attributes: string;
  rating?: string;
  reviews?: number;
  paragraphs: string[];
  metadata: { label: string; value: string }[];
};

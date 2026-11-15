import type { NFT } from "./nft";

export type Favorites = { nftIds: string[]; items: NFT[] };
export type FavoriteResult = { nftId: string; isFavorite: boolean };
export type FavoriteChange = FavoriteResult & { ownerId: string };

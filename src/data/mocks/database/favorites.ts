import { z } from "zod";

const storageKey = "marketplace-nfts:mock-favorites:v1";
const favoritesSchema = z.array(
  z.object({ userId: z.string().min(1), nftId: z.string().min(1) }),
);
type StoredFavorite = z.infer<typeof favoritesSchema>[number];
let memoryFavorites: StoredFavorite[] = [];

const readFavorites = (): StoredFavorite[] => {
  if (typeof window === "undefined") return memoryFavorites;
  const stored = window.localStorage.getItem(storageKey);
  return stored ? favoritesSchema.parse(JSON.parse(stored)) : [];
};

const saveFavorites = (favorites: StoredFavorite[]) => {
  if (typeof window !== "undefined")
    window.localStorage.setItem(storageKey, JSON.stringify(favorites));
  memoryFavorites = favorites;
};

export const getFavoriteIds = (userId: string) => [
  ...new Set(
    readFavorites()
      .filter((entry) => entry.userId === userId)
      .map((entry) => entry.nftId),
  ),
];

export const setFavorite = (
  userId: string,
  nftId: string,
  isFavorite: boolean,
) => {
  const next = readFavorites().filter(
    (entry) => entry.userId !== userId || entry.nftId !== nftId,
  );
  if (isFavorite) next.push({ userId, nftId });
  saveFavorites(next);
  return { nftId, isFavorite };
};

export const resetFavorites = () => saveFavorites([]);

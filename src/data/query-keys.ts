import type { CatalogueSearch } from "./types/catalogue";

export const queryKeys = {
  nfts: {
    all: ["nfts"] as const,
    lists: ["nfts", "list"] as const,
    list: (search: CatalogueSearch) => ["nfts", "list", search] as const,
    detail: (id: string) => ["nfts", "detail", id] as const,
  },
  auth: {
    all: ["auth"] as const,
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    session: ["auth", "session"] as const,
    logout: ["auth", "logout"] as const,
  },
  profile: {
    all: ["profile"] as const,
    current: ["profile", "current"] as const,
    update: ["profile", "update"] as const,
  },
} as const;

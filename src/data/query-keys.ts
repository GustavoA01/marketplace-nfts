import type { QuoteNetwork } from "./types/quote";
import type { CatalogueSearch } from "./types/catalogue";

export const queryKeys = {
  quotes: {
    all: ["quotes"] as const,
    current: (
      userId: string | undefined,
      signature: string,
      network?: QuoteNetwork,
    ) =>
      ["quotes", userId ?? "visitor", signature, network ?? "default"] as const,
  },
  cart: {
    all: ["cart"] as const,
    current: (userId?: string) =>
      ["cart", "current", userId ?? "visitor"] as const,
    add: ["cart", "add"] as const,
    update: ["cart", "update"] as const,
    remove: ["cart", "remove"] as const,
    applyCoupon: ["cart", "coupon", "apply"] as const,
    removeCoupon: ["cart", "coupon", "remove"] as const,
  },
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
  wallets: {
    all: ["wallets"] as const,
    list: (userId: string) => ["wallets", "list", userId] as const,
    create: ["wallets", "create"] as const,
    update: ["wallets", "update"] as const,
  },
} as const;

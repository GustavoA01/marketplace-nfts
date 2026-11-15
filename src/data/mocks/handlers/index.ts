import { type AnyHandler } from "msw";
import { authHandlers } from "./auth";
import { cartHandlers } from "./cart";
import { favoriteHandlers } from "./favorites";
import { nftsHandlers } from "./nfts";
import { orderHandlers } from "./orders";
import { profileHandlers } from "./profile";
import { quoteHandlers } from "./quotes";
import { realtimeHandlers } from "./realtime";
import { walletsHandlers } from "./wallets";

export const handlers: AnyHandler[] = [
  ...realtimeHandlers,
  ...favoriteHandlers,
  ...orderHandlers,
  ...quoteHandlers,
  ...cartHandlers,
  ...authHandlers,
  ...profileHandlers,
  ...walletsHandlers,
  ...nftsHandlers,
];

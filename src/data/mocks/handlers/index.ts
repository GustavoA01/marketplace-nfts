import { favoriteHandlers } from "./favorites";
import { orderHandlers } from "./orders";
import { quoteHandlers } from "./quotes";
import { cartHandlers } from "./cart";
import { type RequestHandler } from "msw";
import { authHandlers } from "./auth";
import { nftsHandlers } from "./nfts";
import { profileHandlers } from "./profile";
import { walletsHandlers } from "./wallets";

export const handlers: RequestHandler[] = [
  ...favoriteHandlers,
  ...orderHandlers,
  ...quoteHandlers,
  ...cartHandlers,
  ...authHandlers,
  ...profileHandlers,
  ...walletsHandlers,
  ...nftsHandlers,
];

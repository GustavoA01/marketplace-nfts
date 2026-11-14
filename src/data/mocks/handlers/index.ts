import { quoteHandlers } from "./quotes";
import { cartHandlers } from "./cart";
import { type RequestHandler } from "msw";
import { authHandlers } from "./auth";
import { nftsHandlers } from "./nfts";
import { profileHandlers } from "./profile";
import { walletsHandlers } from "./wallets";

export const handlers: RequestHandler[] = [
  ...quoteHandlers,
  ...cartHandlers,
  ...authHandlers,
  ...profileHandlers,
  ...walletsHandlers,
  ...nftsHandlers,
];

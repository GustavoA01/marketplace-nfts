import { type RequestHandler } from "msw";
import { authHandlers } from "./auth";
import { nftsHandlers } from "./nfts";
import { profileHandlers } from "./profile";

export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...profileHandlers,
  ...nftsHandlers,
];

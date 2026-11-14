import { type RequestHandler } from "msw";
import { authHandlers } from "./auth";
import { nftsHandlers } from "./nfts";

export const handlers: RequestHandler[] = [...authHandlers, ...nftsHandlers];

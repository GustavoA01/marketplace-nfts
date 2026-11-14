import { http } from "msw/http";
import { listNFTsHandler } from "./nfts/list";
import { nftDetailHandler } from "./nfts/detail";

export const nftsHandlers = [
  http.get("/api/nfts", listNFTsHandler),
  http.get("/api/nfts/:id", nftDetailHandler),
];

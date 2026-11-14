import { http } from "msw/http";
import { listNFTsHandler } from "./list";
import { nftDetailHandler } from "./detail";

export const nftsHandlers = [
  http.get("/api/nfts", listNFTsHandler),
  http.get("/api/nfts/:id", nftDetailHandler),
];

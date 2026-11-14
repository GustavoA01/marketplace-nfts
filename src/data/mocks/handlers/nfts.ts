import { http } from "msw";

export const nftsHandlers = [
  http.get("/api/nfts", () => {
    return new Response(
      JSON.stringify([
        { id: 1, name: "NFT 1" },
        { id: 2, name: "NFT 2" },
      ]),
      {
        status: 200,
      },
    );
  }),
  http.get("/api/nfts/:id", ({ params }) => {
    return new Response(
      JSON.stringify({
        id: params.id,
      }),
      {
        status: 200,
      },
    );
  }),
];

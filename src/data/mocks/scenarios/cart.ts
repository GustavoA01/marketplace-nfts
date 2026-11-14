import { delay } from "msw";
import { HttpResponse } from "msw/http";
import type { CartApiError } from "@/data/types/cart";

export const simulateCartRequest = async (request: Request) => {
  let scenario: string | null = null;
  try {
    scenario = localStorage.getItem("marketplace-nfts:cart-scenario");
  } catch {
    scenario = null;
  }
  await delay(scenario === "slow" ? 2000 : 150);
  if (scenario === "offline") return HttpResponse.error();
  if (
    scenario === "error" ||
    (scenario === "mutation-error" && request.method !== "GET")
  ) {
    return HttpResponse.json<CartApiError>(
      {
        code: "STORAGE_UNAVAILABLE",
        message: "O carrinho está temporariamente indisponível.",
      },
      { status: 503 },
    );
  }
};

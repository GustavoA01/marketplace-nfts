import { delay } from "msw";
import { HttpResponse } from "msw/http";

export const catalogueScenarioKey = "marketplace-nfts:catalogue-scenario";

export const simulateCatalogueRequest = async (request: Request) => {
  let scenario: string | null = null;
  try {
    scenario = localStorage.getItem(catalogueScenarioKey);
  } catch {
    scenario = null;
  }
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const duration =
    scenario === "slow"
      ? 2000
      : scenario === "out-of-order"
        ? query.length < 4
          ? 1500
          : 150
        : scenario === "timeout"
          ? 16_000
          : 250;
  await delay(duration);
  if (scenario === "offline") return HttpResponse.error();
  if (scenario === "error") {
    return HttpResponse.json(
      { message: "O catálogo está temporariamente indisponível." },
      { status: 503 },
    );
  }
  return scenario;
};

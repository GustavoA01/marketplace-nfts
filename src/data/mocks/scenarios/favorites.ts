import { delay } from "msw";
import { HttpResponse } from "msw/http";

export const favoriteScenarioKey = "marketplace-nfts:favorite-scenario";

export const simulateFavoriteRequest = async (request: Request) => {
  let scenario: string | null = null;
  try {
    scenario = localStorage.getItem(favoriteScenarioKey);
  } catch {
    scenario = null;
  }
  await delay(
    scenario === "slow" || scenario === "slow-mutation-error" ? 2000 : 150,
  );
  if (scenario === "offline") return HttpResponse.error();
  if (
    scenario === "error" ||
    (["mutation-error", "slow-mutation-error"].includes(scenario ?? "") &&
      request.method !== "GET")
  )
    return HttpResponse.json(
      { message: "Não foi possível atualizar os favoritos. Tente novamente." },
      { status: 503 },
    );
};

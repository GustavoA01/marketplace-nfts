import { delay } from "msw";
import { HttpResponse } from "msw/http";
import type { WalletApiError } from "@/data/types/wallets";

export const walletScenarioKey = "marketplace-nfts:wallet-scenario";

export const simulateWalletRequest = async (request: Request) => {
  let scenario: string | null = null;
  try {
    scenario = localStorage.getItem(walletScenarioKey);
  } catch {
    scenario = null;
  }

  await delay(scenario === "slow" ? 2000 : 150);

  if (scenario === "offline") return HttpResponse.error();

  if (
    scenario === "error" ||
    (scenario === "mutation-error" && request.method !== "GET")
  ) {
    return HttpResponse.json<WalletApiError>(
      { message: "As carteiras estão temporariamente indisponíveis." },
      { status: 503 },
    );
  }
};

import { z } from "zod";
import { clearAuthCookie } from "@/lib/auth-cookie";

export const scenarioNames = [
  "normal",
  "price-change",
  "stock-change",
  "duplicate-events",
  "old-events",
  "disconnect-order",
  "payment-declined",
  "pending",
] as const;

export type RealtimeScenarioName = (typeof scenarioNames)[number];

export const marketScenarioNames = [
  "price-change",
  "stock-change",
  "duplicate-events",
  "old-events",
] as const satisfies readonly RealtimeScenarioName[];

const schema = z.object({
  scenario: z.enum(scenarioNames),
  manual: z.boolean(),
  nftId: z.string().optional(),
});
const key = "marketplace-nfts:realtime-scenario:v1";

export const readRealtimeScenario = () => {
  try {
    const value = sessionStorage.getItem(key);
    return value ? schema.parse(JSON.parse(value)) : undefined;
  } catch {
    return undefined;
  }
};

export const configureRealtimeScenario = () => {
  const params = new URL(window.location.href).searchParams;
  if (params.get("scenario") === "reset") {
    for (const storage of [localStorage, sessionStorage])
      for (const name of Object.keys(storage))
        if (name.startsWith("marketplace-nfts:")) storage.removeItem(name);
    clearAuthCookie();
    return;
  }

  const scenario = z.enum(scenarioNames).safeParse(params.get("scenario"));
  if (!scenario.success) return;

  sessionStorage.setItem(
    key,
    JSON.stringify({
      scenario: scenario.data,
      manual: params.get("trigger") === "manual",
      nftId: params.get("nft") || undefined,
    }),
  );

  const paymentKey = "marketplace-nfts:payment-scenario";
  if (scenario.data === "payment-declined" || scenario.data === "pending")
    localStorage.setItem(paymentKey, scenario.data);
  else localStorage.removeItem(paymentKey);
};

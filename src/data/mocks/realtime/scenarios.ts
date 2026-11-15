import { ethToWei, weiToEth } from "@/lib/eth";
import { getCart } from "../database/cart";
import { getNFTPrice } from "../database/market-store";
import { nfts } from "../fixtures/nfts";
import {
  marketScenarioNames,
  readRealtimeScenario,
  type RealtimeScenarioName,
} from "./config";
import { changeNFT } from "./market";
import { replayMockEvent } from "./bus";
import { disconnectClients } from "./clients";

const armed = new Set<string>();
const marketScenarios = new Set<string>(marketScenarioNames);

const isMarketScenario = (scenario: RealtimeScenarioName) =>
  marketScenarios.has(scenario);

export const runMarketScenario = (userId?: string) => {
  const config = readRealtimeScenario();

  if (!config || !isMarketScenario(config.scenario)) return undefined;

  const cart = getCart(userId);
  const nftId = config.nftId ?? cart.items[0]?.nftId;
  const nft = nfts.find((entry) => entry.id === nftId);
  if (!nft || !cart.items.some((item) => item.nftId === nftId))
    return undefined;

  const event = changeNFT(
    nft.id,
    config.scenario === "stock-change"
      ? { supply: 0 }
      : { price: weiToEth(ethToWei(getNFTPrice(nft)) + ethToWei("0.30")) },
  );
  const replay =
    config.scenario === "duplicate-events" || config.scenario === "old-events";

  if (replay)
    replayMockEvent(`nft.updated:${nft.id}`, config.scenario === "old-events");

  return event;
};

export const armCartScenario = (userId?: string) => {
  const config = readRealtimeScenario();

  if (!config || config.manual || !isMarketScenario(config.scenario)) return;
  if (!getCart(userId).items.length) return;

  const key = `${userId ?? "visitor"}:${config.scenario}`;
  if (armed.has(key)) return;
  armed.add(key);

  setTimeout(() => {
    runMarketScenario(userId);
  }, 5000);
};

export const maybeDisconnectOrder = (userId: string) => {
  if (readRealtimeScenario()?.scenario !== "disconnect-order") return;
  const key = `${userId}:disconnect-order`;
  if (armed.has(key)) return;
  armed.add(key);
  setTimeout(() => disconnectClients(userId, 5500), 100);
};

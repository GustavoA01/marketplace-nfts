import { http } from "@/lib/http";
import type { WalletsResponse } from "@/data/types/wallets";

export const getWallets = async (signal?: AbortSignal) => {
  const { data } = await http.get<WalletsResponse>("/wallets", { signal });
  return data.wallets;
};

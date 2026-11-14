import { http } from "@/lib/http";
import type { CreateWalletPayload, WalletResponse } from "@/data/types/wallets";

export const createWallet = async (payload: CreateWalletPayload) => {
  const { data } = await http.post<WalletResponse>("/wallets", payload);
  return data.wallet;
};

import { http } from "@/lib/http";
import type { UpdateWalletPayload, WalletResponse } from "@/data/types/wallets";

export const updateWallet = async (
  walletId: string,
  payload: UpdateWalletPayload,
) => {
  const { data } = await http.patch<WalletResponse>(
    `/wallets/${walletId}`,
    payload,
  );
  return data.wallet;
};

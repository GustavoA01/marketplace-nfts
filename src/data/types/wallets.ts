import type { WalletFormValues } from "@/data/schemas/wallets";

export type WalletKind = "main" | "secondary";

export type Wallet = WalletFormValues & {
  id: string;
  kind: WalletKind;
};

export type WalletsResponse = { wallets: Wallet[] };
export type WalletResponse = { wallet: Wallet };

export type CreateWalletPayload = WalletFormValues & { kind: WalletKind };
export type UpdateWalletPayload = WalletFormValues;

export type WalletApiError = {
  message: string;
  errors?: Partial<Record<keyof WalletFormValues | "kind", string>>;
};

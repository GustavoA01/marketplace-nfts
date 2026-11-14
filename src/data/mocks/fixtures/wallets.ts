import type { Wallet } from "@/data/types/wallets";

export type MockWallet = Wallet & { userId: string };

export const walletFixtures: MockWallet[] = [
  {
    id: "wallet-luna-main",
    userId: "collector-luna",
    kind: "main",
    displayName: "Luna Colecionadora",
    alias: "Carteira principal",
    network: "ethereum",
    profileName: "lunacurator",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    secondaryAddress: "",
    walletType: "metamask",
    referralCode: "KURIO2026",
    email: "luna.colecionadora@email.com",
    ensSuffix: ".eth",
    ensName: "luna",
  },
];

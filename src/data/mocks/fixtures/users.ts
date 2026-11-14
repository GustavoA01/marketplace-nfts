import type { AuthUser } from "@/data/types/auth";

export type MockUser = AuthUser & {
  passwordHash: string;
  passwordSalt: string;
  ensName: string;
  ensSuffix: ".eth" | ".xyz";
  walletAlias: string;
};

export const userFixtures: MockUser[] = [
  {
    id: "collector-luna",
    username: "lunacurator",
    email: "luna@example.com",
    displayName: "Luna Colecionadora",
    ensName: "luna",
    ensSuffix: ".eth",
    walletAlias: "Carteira principal",
    avatarUrl: null,
    passwordHash:
      "9f066413a845b5eabfdbd94712d833a04df73901a6ee8c5f8062822b5242a6a4",
    passwordSalt: "831a71cf0663fc6ffb69e3129ee1a036",
  },
  {
    id: "collector-theo",
    username: "theocollector",
    email: "theo@example.com",
    displayName: "Theo Colecionador",
    ensName: "theo",
    ensSuffix: ".xyz",
    walletAlias: "Carteira principal",
    avatarUrl: null,
    passwordHash:
      "77a1e962aa6dbb0f8365e7cd78f8813a5e1e6412316196624c731c6ae5bc9647",
    passwordSalt: "599b11e03a800daa50d3fb43570ff003",
  },
];

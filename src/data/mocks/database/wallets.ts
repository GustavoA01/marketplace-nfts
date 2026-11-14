import { z } from "zod";
import { walletNetworks, walletTypes } from "@/data/schemas/wallets";
import type {
  CreateWalletPayload,
  UpdateWalletPayload,
  Wallet,
} from "@/data/types/wallets";
import { walletFixtures, type MockWallet } from "../fixtures/wallets";

const storageKey = "marketplace-nfts:mock-wallets:v1";

const walletsSchema = z.array(
  z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    kind: z.enum(["main", "secondary"]),
    displayName: z.string(),
    alias: z.string(),
    network: z.enum(walletNetworks),
    profileName: z.string(),
    address: z.string(),
    secondaryAddress: z.string().optional(),
    walletType: z.enum(walletTypes),
    referralCode: z.string().optional(),
    email: z.email(),
    ensSuffix: z.enum([".eth", ".xyz"]),
    ensName: z.string().optional(),
  }),
);

let memoryWallets = structuredClone(walletFixtures);

const normalizeWallet = (
  wallet: z.infer<typeof walletsSchema>[number],
): MockWallet => ({
  id: wallet.id,
  userId: wallet.userId,
  kind: wallet.kind,
  displayName: wallet.displayName,
  alias: wallet.alias,
  network: wallet.network,
  profileName: wallet.profileName,
  address: wallet.address,
  secondaryAddress: wallet.secondaryAddress ?? "",
  walletType: wallet.walletType,
  referralCode: wallet.referralCode ?? "",
  email: wallet.email,
  ensSuffix: wallet.ensSuffix,
  ensName: wallet.ensName ?? "",
});

export const toPublicWallet = (wallet: MockWallet): Wallet => {
  const { userId, ...publicWallet } = wallet;
  void userId;
  return publicWallet;
};

export const getWallets = (): MockWallet[] => {
  if (typeof window === "undefined") return memoryWallets;
  const stored = window.localStorage.getItem(storageKey);
  return stored
    ? walletsSchema.parse(JSON.parse(stored)).map(normalizeWallet)
    : structuredClone(walletFixtures);
};

const saveWallets = (wallets: MockWallet[]) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(wallets));
  }
  memoryWallets = wallets;
};

export const resetWallets = () => saveWallets(structuredClone(walletFixtures));

export const getWalletsByUserId = (userId: string) =>
  getWallets()
    .filter((wallet) => wallet.userId === userId)
    .map(toPublicWallet);

export const getWalletByIdForUser = (walletId: string, userId: string) => {
  const wallet = getWallets().find(
    (entry) => entry.id === walletId && entry.userId === userId,
  );
  return wallet ? toPublicWallet(wallet) : null;
};

export const createWallet = (
  userId: string,
  data: CreateWalletPayload,
): Wallet | { conflict: true } => {
  const wallets = getWallets();
  if (
    wallets.some((entry) => entry.userId === userId && entry.kind === data.kind)
  ) {
    return { conflict: true };
  }

  const wallet: MockWallet = {
    id: crypto.randomUUID(),
    userId,
    kind: data.kind,
    displayName: data.displayName.trim(),
    alias: data.alias.trim(),
    network: data.network,
    profileName: data.profileName.trim(),
    address: data.address.trim(),
    secondaryAddress: data.secondaryAddress?.trim() ?? "",
    walletType: data.walletType,
    referralCode: data.referralCode?.trim() ?? "",
    email: data.email.trim().toLowerCase(),
    ensSuffix: data.ensSuffix,
    ensName: data.ensName?.trim() ?? "",
  };

  saveWallets([...wallets, wallet]);
  return toPublicWallet(wallet);
};

export const updateWallet = (
  userId: string,
  walletId: string,
  data: UpdateWalletPayload,
): Wallet | null => {
  const wallets = getWallets();
  const index = wallets.findIndex(
    (entry) => entry.id === walletId && entry.userId === userId,
  );
  if (index < 0) return null;

  const current = wallets[index];
  const updated: MockWallet = {
    ...current,
    displayName: data.displayName.trim(),
    alias: data.alias.trim(),
    network: data.network,
    profileName: data.profileName.trim(),
    address: data.address.trim(),
    secondaryAddress: data.secondaryAddress?.trim() ?? "",
    walletType: data.walletType,
    referralCode: data.referralCode?.trim() ?? "",
    email: data.email.trim().toLowerCase(),
    ensSuffix: data.ensSuffix,
    ensName: data.ensName?.trim() ?? "",
  };

  const next = [...wallets];
  next[index] = updated;
  saveWallets(next);
  return toPublicWallet(updated);
};

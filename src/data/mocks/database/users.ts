import { z } from "zod";
import type { SignUpFormValues } from "@/data/schemas/auth";
import type { AuthUser } from "@/data/types/auth";
import type { CollectorProfile } from "@/data/types/profile";
import type { UpdateProfilePayload } from "@/data/types/profile";
import { userFixtures, type MockUser } from "../fixtures/users";
import { hashPassword, verifyPassword } from "../utils/password";

const storageKey = "marketplace-nfts:mock-users:v1";
const usersSchema = z.array(
  z.object({
    id: z.string().min(1),
    username: z.string().min(1),
    email: z.email(),
    passwordHash: z.string().regex(/^[a-f0-9]{64}$/),
    passwordSalt: z.string().regex(/^[a-f0-9]{32}$/),
    displayName: z.string().optional(),
    ensName: z.string().optional(),
    ensSuffix: z.enum([".eth", ".xyz"]).optional(),
    walletAlias: z.string().optional(),
    avatarUrl: z.string().nullable().optional(),
  }),
);

const normalizeUser = (
  user: z.infer<typeof usersSchema>[number],
): MockUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  passwordHash: user.passwordHash,
  passwordSalt: user.passwordSalt,
  displayName: user.displayName ?? user.username,
  ensName: user.ensName ?? "",
  ensSuffix: user.ensSuffix ?? ".eth",
  walletAlias: user.walletAlias ?? "Carteira principal",
  avatarUrl: user.avatarUrl ?? null,
});

let memoryUsers = structuredClone(userFixtures);

export const getUsers = (): MockUser[] => {
  if (typeof window === "undefined") return memoryUsers;
  const stored = window.localStorage.getItem(storageKey);
  return stored
    ? usersSchema.parse(JSON.parse(stored)).map(normalizeUser)
    : structuredClone(userFixtures);
};

const saveUsers = (users: MockUser[]) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(users));
  }
  memoryUsers = users;
};

export const resetUsers = () => saveUsers(structuredClone(userFixtures));

export const toCollectorProfile = (user: MockUser): CollectorProfile => ({
  displayName: user.displayName,
  username: user.username,
  email: user.email,
  ensName: user.ensName,
  ensSuffix: user.ensSuffix,
  walletAlias: user.walletAlias,
  avatarUrl: user.avatarUrl,
});

export const getUserById = (userId: string) =>
  getUsers().find((entry) => entry.id === userId);

export const toAuthUser = (user: MockUser): AuthUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
});

export const createUser = async (
  data: SignUpFormValues,
): Promise<AuthUser | null> => {
  const email = data.email.trim().toLowerCase();
  if (getUsers().some((user) => user.email.toLowerCase() === email))
    return null;

  const credentials = await hashPassword(data.password);
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === email)) return null;

  const username = data.username.trim();
  const user: MockUser = {
    id: crypto.randomUUID(),
    username,
    email,
    displayName: username,
    ensName: "",
    ensSuffix: ".eth",
    walletAlias: "Carteira principal",
    avatarUrl: null,
    ...credentials,
  };
  saveUsers([...users, user]);

  return toAuthUser(user);
};

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<AuthUser | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find(
    (entry) => entry.email.toLowerCase() === normalizedEmail,
  );
  if (!user) return null;

  const isValid = await verifyPassword(
    password,
    user.passwordHash,
    user.passwordSalt,
  );
  if (!isValid) return null;

  return toAuthUser(user);
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfilePayload,
): Promise<
  | { profile: CollectorProfile }
  | { conflict: "email" | "username" }
  | { invalidPassword: true }
  | null
> => {
  const users = getUsers();
  const index = users.findIndex((entry) => entry.id === userId);
  if (index < 0) return null;

  const current = users[index];
  const email = data.email.trim().toLowerCase();
  const username = data.username.trim();

  if (
    users.some(
      (entry) => entry.id !== userId && entry.email.toLowerCase() === email,
    )
  ) {
    return { conflict: "email" };
  }

  if (
    users.some(
      (entry) =>
        entry.id !== userId &&
        entry.username.toLowerCase() === username.toLowerCase(),
    )
  ) {
    return { conflict: "username" };
  }

  let passwordHash = current.passwordHash;
  let passwordSalt = current.passwordSalt;
  const changingPassword = Boolean(
    data.currentPassword || data.newPassword || data.confirmNewPassword,
  );

  if (changingPassword) {
    const isValid = await verifyPassword(
      data.currentPassword ?? "",
      current.passwordHash,
      current.passwordSalt,
    );
    if (!isValid) return { invalidPassword: true };
    const credentials = await hashPassword(data.newPassword ?? "");
    passwordHash = credentials.passwordHash;
    passwordSalt = credentials.passwordSalt;
  }

  const updated: MockUser = {
    ...current,
    displayName: data.displayName.trim(),
    username,
    email,
    ensName: data.ensName.trim(),
    ensSuffix: data.ensSuffix,
    walletAlias: data.walletAlias.trim(),
    avatarUrl: data.avatarUrl,
    passwordHash,
    passwordSalt,
  };

  const next = [...users];
  next[index] = updated;
  saveUsers(next);

  return { profile: toCollectorProfile(updated) };
};

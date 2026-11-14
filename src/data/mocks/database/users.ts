import { z } from "zod";
import type { SignUpFormValues } from "@/data/schemas/auth";
import type { AuthUser } from "@/data/types/auth";
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
  }),
);

let memoryUsers = structuredClone(userFixtures);

export const getUsers = (): MockUser[] => {
  if (typeof window === "undefined") return memoryUsers;
  const stored = window.localStorage.getItem(storageKey);
  return stored
    ? usersSchema.parse(JSON.parse(stored))
    : structuredClone(userFixtures);
};

const saveUsers = (users: MockUser[]) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(users));
  }
  memoryUsers = users;
};

export const resetUsers = () => saveUsers(structuredClone(userFixtures));

export const createUser = async (
  data: SignUpFormValues,
): Promise<AuthUser | null> => {
  const email = data.email.trim().toLowerCase();
  if (getUsers().some((user) => user.email.toLowerCase() === email))
    return null;

  const credentials = await hashPassword(data.password);
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === email)) return null;

  const user: MockUser = {
    id: crypto.randomUUID(),
    username: data.username.trim(),
    email,
    ...credentials,
  };
  saveUsers([...users, user]);

  return { id: user.id, username: user.username, email: user.email };
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

  return { id: user.id, username: user.username, email: user.email };
};

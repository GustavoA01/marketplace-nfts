import { z } from "zod";
import type { CollectorValues } from "@/data/schemas/orders";

const schema = z.object({
  displayName: z.string().optional(),
  username: z.string().optional(),
  profileName: z.string().optional(),
  email: z.string().optional(),
  note: z.string().optional(),
});

const key = (userId: string) => `marketplace-nfts:checkout-draft:${userId}`;

export const readCheckoutDraft = (
  userId?: string,
): Partial<CollectorValues> => {
  if (!userId) return {};

  try {
    const value = sessionStorage.getItem(key(userId));

    return value ? schema.parse(JSON.parse(value)) : {};
  } catch {
    return {};
  }
};

export const saveCheckoutDraft = (
  userId: string,
  values: Partial<CollectorValues>,
) => {
  try {
    sessionStorage.setItem(key(userId), JSON.stringify(schema.parse(values)));
  } catch {
    return;
  }
};

export const clearCheckoutDraft = (userId: string) => {
  try {
    sessionStorage.removeItem(key(userId));
  } catch {
    return;
  }
};

import type { ProfileFormValues } from "@/data/schemas/profile";

export type CollectorProfile = {
  displayName: string;
  username: string;
  email: string;
  ensSuffix: ".eth" | ".xyz";
  ensName: string;
  walletAlias: string;
  avatarUrl: string | null;
};

export type ProfileResponse = { profile: CollectorProfile };

export type UpdateProfilePayload = ProfileFormValues & {
  avatarUrl: string | null;
};

export type ProfileApiError = {
  message: string;
  errors?: Partial<Record<keyof ProfileFormValues, string>>;
};

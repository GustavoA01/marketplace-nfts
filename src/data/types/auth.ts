import type { LoginFormValues, SignUpFormValues } from "@/data/schemas/auth";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

export type RegisterResponse = { user: AuthUser };
export type LoginResponse = { user: AuthUser; sessionId: string };
export type SessionResponse = { user: AuthUser };
export type AuthField = keyof SignUpFormValues | keyof LoginFormValues;
export type AuthApiError = {
  message: string;
  errors?: Partial<Record<AuthField, string>>;
};

import { isAxiosError } from "axios";
import { http } from "@/lib/http";
import type { AuthUser, SessionResponse } from "@/data/types/auth";

export const getSession = async (
  signal?: AbortSignal,
): Promise<AuthUser | null> => {
  try {
    const { data } = await http.get<SessionResponse>("/auth/session", {
      signal,
    });
    return data.user;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
};

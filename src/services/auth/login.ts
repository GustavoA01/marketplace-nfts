import { http as api } from "@/lib/http";
import type { LoginFormValues } from "@/data/schemas/auth";
import type { LoginResponse } from "@/data/types/auth";
import { writeAuthCookie } from "@/lib/auth-cookie";

export const loginUser = async (data: LoginFormValues) => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  writeAuthCookie(response.data.sessionId);
  return response.data;
};

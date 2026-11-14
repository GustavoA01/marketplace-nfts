import { http as api } from "@/lib/http";
import type { SignUpFormValues } from "@/data/schemas/auth";
import type { RegisterResponse } from "@/data/types/auth";

export const registerUser = async (data: SignUpFormValues) => {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
};

import { http } from "@/lib/http";
import type { ProfileResponse } from "@/data/types/profile";

export const getProfile = async (signal?: AbortSignal) => {
  const { data } = await http.get<ProfileResponse>("/profile", { signal });
  return data.profile;
};

import { http } from "@/lib/http";
import type {
  ProfileResponse,
  UpdateProfilePayload,
} from "@/data/types/profile";

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await http.patch<ProfileResponse>("/profile", payload);
  return data.profile;
};

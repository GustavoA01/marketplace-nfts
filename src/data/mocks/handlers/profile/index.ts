import { http } from "msw/http";
import type { AuthApiError } from "@/data/types/auth";
import type {
  ProfileApiError,
  ProfileResponse,
  UpdateProfilePayload,
} from "@/data/types/profile";
import { getProfileHandler } from "./get";
import { updateProfileHandler } from "./update";

const profilePrefix = "/api/profile";

export const profileHandlers = [
  http.get<never, never, ProfileResponse | AuthApiError>(
    profilePrefix,
    getProfileHandler,
  ),
  http.patch<
    never,
    UpdateProfilePayload,
    ProfileResponse | ProfileApiError | AuthApiError
  >(profilePrefix, updateProfileHandler),
];

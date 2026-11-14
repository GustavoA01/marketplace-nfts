import type { AuthUser } from "@/data/types/auth";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/data/query-keys";

export const clearUserCache = async () => {
  await queryClient.cancelQueries();
  queryClient.removeQueries({
    predicate: ({ queryKey }) =>
      queryKey[0] !== "auth" || queryKey[1] !== "session",
  });
  queryClient.getMutationCache().clear();
};

export const setSessionUser = async (user: AuthUser | null) => {
  await clearUserCache();
  queryClient.setQueryData(queryKeys.auth.session, user);
};

import type { Query } from "@tanstack/react-query";
import type { AuthUser } from "@/data/types/auth";
import { queryClient } from "@/lib/query-client";
import { queryKeys } from "@/data/query-keys";

export const clearUserCache = async (preserveVisitorCart = false) => {
  const predicate = ({ queryKey }: Query) => {
    if (queryKey[0] === "auth" && queryKey[1] === "session") return false;
    if (
      preserveVisitorCart &&
      queryKey[0] === "cart" &&
      queryKey[2] === "visitor"
    )
      return false;
    return true;
  };
  await queryClient.cancelQueries({ predicate });
  queryClient.removeQueries({ predicate });
  queryClient.getMutationCache().clear();
};

export const setSessionUser = async (user: AuthUser | null) => {
  await clearUserCache();
  queryClient.setQueryData(queryKeys.auth.session, user);
};

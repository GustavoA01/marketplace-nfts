import type { AuthUser } from "@/data/types/auth";
import { clearAuthCookie } from "./auth-cookie";
import { queryKeys } from "@/data/query-keys";
import {
  QueryClient,
  QueryCache,
  MutationCache,
  type QueryKey,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";

const handleUnauthorized = (
  error: unknown,
  key?: QueryKey,
  ownerId?: unknown,
) => {
  if (
    typeof ownerId === "string" &&
    queryClient.getQueryData<AuthUser | null>(queryKeys.auth.session)?.id !==
      ownerId
  )
    return;
  const isCredentialRequest =
    key?.[0] === queryKeys.auth.all[0] &&
    (key[1] === queryKeys.auth.login[1] ||
      key[1] === queryKeys.auth.register[1]);
  if (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    !isCredentialRequest
  ) {
    clearAuthCookie();
    queryClient.setQueryData(queryKeys.auth.session, null);
  }
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) =>
      handleUnauthorized(error, query.queryKey, query.meta?.ownerId),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) =>
      handleUnauthorized(
        error,
        mutation.options.mutationKey,
        mutation.meta?.ownerId,
      ),
  }),
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

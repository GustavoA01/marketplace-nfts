import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/data/query-keys";
import { getSession } from "@/services/auth/session";

export const sessionQueryOptions = queryOptions({
  queryKey: queryKeys.auth.session,
  queryFn: ({ signal }) => getSession(signal),
  retry: false,
  staleTime: 30_000,
  refetchInterval: 30_000,
  refetchOnWindowFocus: "always",
});

export const useSession = () => useQuery(sessionQueryOptions);

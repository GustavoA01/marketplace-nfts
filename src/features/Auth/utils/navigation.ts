import { redirect } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";
import { sessionQueryOptions } from "../hooks/useSession";

export const safeReturnTo = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.startsWith("/")) return undefined;
  const base = "https://marketplace.invalid";
  const url = new URL(value, base);
  if (url.origin !== base || /^\/(login|cadastro)(\/|$)/.test(url.pathname))
    return undefined;
  return `${url.pathname}${url.search}${url.hash}`;
};

export const requireSession = async ({
  location,
}: {
  location: { href: string };
}) => {
  const user = await queryClient.fetchQuery({
    ...sessionQueryOptions,
    staleTime: 0,
  });
  if (!user) {
    throw redirect({ to: "/login", search: { redirect: location.href } });
  }
  return { user };
};

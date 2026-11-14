import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { AuthUser } from "@/data/types/auth";
import type { Cart, CartApiError } from "@/data/types/cart";
import { queryKeys } from "@/data/query-keys";
import { getCart } from "@/services/cart/get";

export const cartQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: queryKeys.cart.current(userId),
    queryFn: ({ signal }) => getCart(signal),
    staleTime: 0,
    retry: (attempt, error) =>
      !(isAxiosError(error) && error.response && error.response.status < 500) &&
      attempt < 1,
  });

export const isCartOwnerActive = (client: QueryClient, userId?: string) =>
  client.getQueryData<AuthUser | null>(queryKeys.auth.session)?.id === userId;

export const commitCartCache = (
  client: QueryClient,
  cart: Cart,
  userId?: string,
) => {
  if (isCartOwnerActive(client, userId))
    client.setQueryData(queryKeys.cart.current(userId), cart);
};

export const cartErrorMessage = (error: unknown) => {
  const message = isAxiosError<CartApiError>(error)
    ? error.response?.data?.message
    : undefined;
  return typeof message === "string"
    ? message
    : "Não foi possível atualizar o carrinho. Tente novamente.";
};

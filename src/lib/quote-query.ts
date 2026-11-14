import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { queryKeys } from "@/data/query-keys";
import type { Cart } from "@/data/types/cart";
import type { QuoteApiError, QuoteNetwork } from "@/data/types/quote";
import { createQuote } from "@/services/quotes/create";
import { cartSignature } from "./cart";
import { commitCartCache } from "./cart-query";

export const quoteQueryOptions = (
  cart: Cart | undefined,
  client: QueryClient,
  userId?: string,
  network?: QuoteNetwork,
) =>
  queryOptions({
    queryKey: queryKeys.quotes.current(
      userId,
      cart ? cartSignature(cart) : "empty",
      network,
    ),
    queryFn: async ({ signal }) => {
      if (!cart)
        throw new Error("Carregue o carrinho antes de calcular os valores.");
      try {
        return await createQuote(
          { cartSignature: cartSignature(cart), network },
          signal,
        );
      } catch (error) {
        if (isAxiosError<QuoteApiError>(error) && error.response?.data.cart)
          commitCartCache(client, error.response.data.cart, userId);
        throw error;
      }
    },
    staleTime: 10_000,
    refetchInterval: 60_000,
    retry: (attempt, error) =>
      !(isAxiosError(error) && error.response && error.response.status < 500) &&
      attempt < 1,
  });

import type { QuotePayload, QuoteResponse } from "@/data/types/quote";
import { http } from "@/lib/http";

export const createQuote = async (
  payload: QuotePayload,
  signal?: AbortSignal,
) => {
  const { data } = await http.post<QuoteResponse>("/quotes", payload, {
    signal,
  });
  return data.quote;
};

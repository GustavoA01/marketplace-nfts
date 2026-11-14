import { http, HttpResponse } from "msw/http";
import { couponSchema, quoteSchema } from "@/data/schemas/quote";
import type { CartApiError, CartResponse } from "@/data/types/cart";
import type { QuoteApiError, QuoteResponse } from "@/data/types/quote";
import { setCartCoupon } from "../../database/coupons";
import { createQuote } from "../../database/quotes";
import { simulateCartRequest } from "../../scenarios/cart";
import { cartStorageError, cartUser, readCartPayload } from "../cart/utils";

export const quoteHandlers = [
  http.post<never, never, QuoteResponse | QuoteApiError>(
    "/api/quotes",
    async ({ request }) => {
      try {
        const initial = cartUser(request);
        if (initial instanceof Response) return initial;
        const payload = await readCartPayload(request, quoteSchema);
        if ("response" in payload) return payload.response;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const result = createQuote(payload.data, user.userId);
        if ("error" in result)
          return HttpResponse.json<QuoteApiError>(result.error, {
            status: result.status,
          });
        return HttpResponse.json<QuoteResponse>({ quote: result.quote });
      } catch {
        return cartStorageError();
      }
    },
  ),
  http.post<never, never, CartResponse | CartApiError>(
    "/api/cart/coupon",
    async ({ request }) => {
      try {
        const initial = cartUser(request);
        if (initial instanceof Response) return initial;
        const payload = await readCartPayload(request, couponSchema);
        if ("response" in payload) return payload.response;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const result = setCartCoupon(payload.data.code, user.userId);
        if ("error" in result)
          return HttpResponse.json<CartApiError>(result.error, {
            status: result.status,
          });
        return HttpResponse.json<CartResponse>({ cart: result.cart });
      } catch {
        return cartStorageError();
      }
    },
  ),
  http.delete<never, never, CartResponse | CartApiError>(
    "/api/cart/coupon",
    async ({ request }) => {
      try {
        const initial = cartUser(request);
        if (initial instanceof Response) return initial;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const result = setCartCoupon(null, user.userId);
        if ("error" in result)
          return HttpResponse.json<CartApiError>(result.error, {
            status: result.status,
          });
        return HttpResponse.json<CartResponse>({ cart: result.cart });
      } catch {
        return cartStorageError();
      }
    },
  ),
];

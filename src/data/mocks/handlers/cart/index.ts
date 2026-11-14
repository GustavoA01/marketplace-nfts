import { http, HttpResponse } from "msw/http";
import { addCartItemSchema, updateCartItemSchema } from "@/data/schemas/cart";
import type { CartApiError, CartResponse } from "@/data/types/cart";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../database/cart";
import { simulateCartRequest } from "../../scenarios/cart";
import { cartStorageError, cartUser, readCartPayload } from "./utils";

export const cartHandlers = [
  http.get<never, never, CartResponse | CartApiError>(
    "/api/cart",
    async ({ request }) => {
      try {
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const currentUser = cartUser(request);
        if (currentUser instanceof Response) return currentUser;
        return HttpResponse.json<CartResponse>({
          cart: getCart(currentUser.userId),
        });
      } catch {
        return cartStorageError();
      }
    },
  ),
  http.post<never, never, CartResponse | CartApiError>(
    "/api/cart/items",
    async ({ request }) => {
      try {
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const payload = await readCartPayload(request, addCartItemSchema);
        if ("response" in payload) return payload.response;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const currentUser = cartUser(request);
        if (currentUser instanceof Response) return currentUser;
        const outcome = addCartItem(payload.data, currentUser.userId);
        if ("error" in outcome)
          return HttpResponse.json(outcome.error, { status: outcome.status });
        return HttpResponse.json<CartResponse>(
          { cart: outcome.cart },
          { status: outcome.created ? 201 : 200 },
        );
      } catch {
        return cartStorageError();
      }
    },
  ),
  http.patch<{ id: string }, never, CartResponse | CartApiError>(
    "/api/cart/items/:id",
    async ({ request, params }) => {
      try {
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const payload = await readCartPayload(request, updateCartItemSchema);
        if ("response" in payload) return payload.response;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const currentUser = cartUser(request);
        if (currentUser instanceof Response) return currentUser;
        const outcome = updateCartItem(
          params.id,
          payload.data.quantity,
          currentUser.userId,
        );
        if ("error" in outcome)
          return HttpResponse.json(outcome.error, { status: outcome.status });
        return HttpResponse.json<CartResponse>({ cart: outcome.cart });
      } catch {
        return cartStorageError();
      }
    },
  ),
  http.delete<{ id: string }, never, CartResponse | CartApiError>(
    "/api/cart/items/:id",
    async ({ request, params }) => {
      try {
        const user = cartUser(request);
        if (user instanceof Response) return user;
        const failure = await simulateCartRequest(request);
        if (failure) return failure;
        const currentUser = cartUser(request);
        if (currentUser instanceof Response) return currentUser;
        const outcome = removeCartItem(params.id, currentUser.userId);
        if ("error" in outcome)
          return HttpResponse.json(outcome.error, { status: outcome.status });
        return HttpResponse.json<CartResponse>({ cart: outcome.cart });
      } catch {
        return cartStorageError();
      }
    },
  ),
];

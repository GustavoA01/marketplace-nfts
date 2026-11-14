import { applyCartCoupon, removeCartCoupon } from "@/services/cart/coupon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Cart } from "@/data/types/cart";
import { queryKeys } from "@/data/query-keys";
import { summarizeCart } from "@/lib/cart";
import {
  cartErrorMessage,
  commitCartCache,
  isCartOwnerActive,
} from "@/lib/cart-query";
import { updateCartItem } from "@/services/cart/update";
import { removeCartItem } from "@/services/cart/remove";

type CartAction = { id: string; ownerId?: string };
type QuantityAction = CartAction & { quantity: number };

export const useCartMutations = (userId?: string) => {
  const client = useQueryClient();
  const refresh = (ownerId?: string) => {
    if (isCartOwnerActive(client, ownerId))
      return client.invalidateQueries({
        queryKey: queryKeys.cart.current(ownerId),
      });
  };
  const update = useMutation({
    mutationKey: queryKeys.cart.update,
    mutationFn: ({ id, quantity }: QuantityAction) =>
      updateCartItem(id, { quantity }),
    retry: false,
    onSuccess: (cart, { ownerId }) => commitCartCache(client, cart, ownerId),
    onError: (error, { ownerId }) => {
      if (isCartOwnerActive(client, ownerId))
        toast.error(cartErrorMessage(error));
    },
    onSettled: (_data, _error, { ownerId }) => refresh(ownerId),
  });
  const remove = useMutation({
    mutationKey: queryKeys.cart.remove,
    mutationFn: ({ id }: CartAction) => removeCartItem(id),
    retry: false,
    onMutate: async ({ id, ownerId }) => {
      const key = queryKeys.cart.current(ownerId);
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<Cart>(key);
      if (previous)
        commitCartCache(
          client,
          summarizeCart(
            previous.items.filter((item) => item.id !== id),
            previous.couponCode,
          ),
          ownerId,
        );
      return { previous };
    },
    onSuccess: (cart, { ownerId }) => {
      commitCartCache(client, cart, ownerId);
      if (isCartOwnerActive(client, ownerId))
        toast.success("Item removido do carrinho.");
    },
    onError: (error, { ownerId }, context) => {
      if (context?.previous) commitCartCache(client, context.previous, ownerId);
      if (isCartOwnerActive(client, ownerId))
        toast.error(cartErrorMessage(error));
    },
    onSettled: (_data, _error, { ownerId }) => refresh(ownerId),
  });
  const coupon = useMutation({
    mutationKey: queryKeys.cart.applyCoupon,
    mutationFn: ({ code }: { code: string; ownerId?: string }) =>
      applyCartCoupon(code),
    retry: false,
    onSuccess: (cart, { ownerId }) => commitCartCache(client, cart, ownerId),
    onSettled: (_data, _error, { ownerId }) => refresh(ownerId),
  });
  const removeCoupon = useMutation({
    mutationKey: queryKeys.cart.removeCoupon,
    mutationFn: (_variables: { ownerId?: string }) => removeCartCoupon(),
    retry: false,
    onSuccess: (cart, { ownerId }) => commitCartCache(client, cart, ownerId),
    onSettled: (_data, _error, { ownerId }) => refresh(ownerId),
  });
  const resetErrors = () => {
    update.reset();
    remove.reset();
    coupon.reset();
    removeCoupon.reset();
  };
  return {
    isPending:
      update.isPending ||
      remove.isPending ||
      coupon.isPending ||
      removeCoupon.isPending,
    error: update.error ?? remove.error,
    couponError: coupon.error ?? removeCoupon.error,
    updateQuantity: (id: string, quantity: number) => {
      resetErrors();
      update.mutate({ id, quantity, ownerId: userId });
    },
    removeItem: (id: string) => {
      resetErrors();
      remove.mutate({ id, ownerId: userId });
    },
    applyCoupon: (code: string) => {
      resetErrors();
      coupon.mutate({ code, ownerId: userId });
    },
    removeCoupon: () => {
      resetErrors();
      removeCoupon.mutate({ ownerId: userId });
    },
  };
};

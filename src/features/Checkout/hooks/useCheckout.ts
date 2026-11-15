import { useState, useRef, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { collectorSchema, type CollectorValues } from "@/data/schemas/orders";
import { queryKeys } from "@/data/query-keys";
import { useSession } from "@/features/Auth/hooks/useSession";
import {
  cartQueryOptions,
  cartErrorMessage,
  isCartOwnerActive,
} from "@/lib/cart-query";
import { quoteQueryOptions } from "@/lib/quote-query";
import {
  getOrderAttempt,
  saveOrderAttempt,
  clearOrderAttempt,
  type OrderAttempt,
} from "@/lib/order-attempt";
import { getProfile } from "@/services/profile/get";
import { getWallets } from "@/services/wallets/list";
import {
  connectWallet,
  disconnectWallet,
  submitOrder,
} from "@/services/orders";

export const useCheckout = () => {
  const { data: user } = useSession();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [walletId, setWalletId] = useState("");
  const [connection, setConnection] = useState<{
    id: string;
    walletId: string;
  }>();
  const [reviewed, setReviewed] = useState("");
  const submitting = useRef(false);
  const cart = useQuery({
    ...cartQueryOptions(user?.id),
    enabled: Boolean(user),
  });
  const wallets = useQuery({
    queryKey: queryKeys.wallets.list(user?.id ?? ""),
    queryFn: ({ signal }) => getWallets(signal),
    enabled: Boolean(user),
  });
  const profile = useQuery({
    queryKey: queryKeys.profile.current,
    queryFn: ({ signal }) => getProfile(signal),
    enabled: Boolean(user),
  });
  const selected =
    wallets.data?.find((entry) => entry.id === walletId) ??
    (!walletId
      ? (wallets.data?.find((entry) => entry.kind === "main") ??
        wallets.data?.[0])
      : undefined);
  const network =
    selected?.network === "ethereum" ||
    selected?.network === "polygon" ||
    selected?.network === "solana"
      ? selected.network
      : undefined;
  const quote = useQuery({
    ...quoteQueryOptions(cart.data, client, user?.id, network),
    enabled: Boolean(
      user && selected && cart.data?.items.length && !cart.isFetching,
    ),
  });
  const form = useForm<CollectorValues>({
    resolver: zodResolver(collectorSchema),
    values: {
      displayName: profile.data?.displayName ?? user?.displayName ?? "",
      username: profile.data?.username ?? user?.username ?? "",
      profileName: profile.data?.username ?? user?.username ?? "",
      email: profile.data?.email ?? user?.email ?? "",
      note: "",
    },
    resetOptions: { keepDirtyValues: true },
  });
  const connectionMutation = useMutation({
    mutationFn: async ({
      id,
      disconnect,
    }: {
      id: string;
      disconnect: boolean;
      ownerId?: string;
    }) => {
      if (disconnect) {
        await disconnectWallet(id);
        return undefined;
      }
      return connectWallet(id);
    },
    retry: false,
    onSuccess: (data, variables) => {
      if (isCartOwnerActive(client, variables.ownerId)) {
        setConnection(data);
        setReviewed("");
      }
    },
    onError: (error) => toast.error(cartErrorMessage(error)),
  });
  const orderMutation = useMutation({
    mutationKey: queryKeys.orders.create,
    mutationFn: ({ attempt }: { attempt: OrderAttempt; owner: string }) =>
      submitOrder(attempt.key, attempt.payload),
    retry: false,
    onSuccess: (_order, { attempt, owner }) => {
      if (isCartOwnerActive(client, owner))
        void navigate({
          to: "/confirmacao-pedido",
          search: { attempt: attempt.key },
        });
    },
    onError: (error, { attempt, owner }) => {
      if (!isCartOwnerActive(client, owner)) return;
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status < 500
      ) {
        clearOrderAttempt(owner);
        setReviewed("");
        toast.error(cartErrorMessage(error));
        void quote.refetch();
      } else {
        void navigate({
          to: "/confirmacao-pedido",
          search: { attempt: attempt.key },
        });
      }
    },
    onSettled: () => {
      submitting.current = false;
    },
  });
  const pendingAttempt = getOrderAttempt(user?.id);
  const connected = Boolean(connection && connection.walletId === selected?.id);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    void form.handleSubmit((collector) => {
      if (
        !user ||
        !quote.data ||
        !connection ||
        !connected ||
        reviewed !== quote.data.id ||
        quote.isFetching ||
        quote.isError ||
        submitting.current ||
        pendingAttempt
      )
        return;
      try {
        const attempt = {
          key: crypto.randomUUID(),
          payload: {
            quoteId: quote.data.id,
            connectionId: connection.id,
            collector,
          },
        };
        saveOrderAttempt(user.id, attempt);
        submitting.current = true;
        orderMutation.mutate({ attempt, owner: user.id });
      } catch {
        submitting.current = false;
        toast.error("Não foi possível preservar esta tentativa no navegador.");
      }
    })(event);
  };
  return {
    user,
    cart,
    wallets,
    profile,
    quote,
    selected,
    form,
    connected,
    reviewed,
    setReviewed,
    pendingAttempt,
    orderMutation,
    connectionMutation,
    busy: orderMutation.isPending,
    onSelect: (id: string) => {
      setWalletId(id);
      setConnection(undefined);
      setReviewed("");
    },
    onConnect: () => {
      if (selected)
        connectionMutation.mutate({
          id: selected.id,
          disconnect: false,
          ownerId: user?.id,
        });
    },
    onDisconnect: () => {
      if (connection)
        connectionMutation.mutate({
          id: connection.id,
          disconnect: true,
          ownerId: user?.id,
        });
    },
    onSubmit,
  };
};

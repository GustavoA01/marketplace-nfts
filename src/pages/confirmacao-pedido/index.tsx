import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { requireSession } from "@/features/Auth/utils/navigation";
import { useSession } from "@/features/Auth/hooks/useSession";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { queryKeys } from "@/data/query-keys";
import { getOrder, submitOrder } from "@/services/orders";
import { getOrderAttempt, clearOrderAttempt } from "@/lib/order-attempt";
import { cartErrorMessage, isCartOwnerActive } from "@/lib/cart-query";
import { OrderReceipt } from "./-components/OrderReceipt";

const Page = () => {
  const { attempt } = Route.useSearch();
  const { data: user } = useSession();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.orders.attempt(user?.id, attempt),
    queryFn: ({ signal }) => getOrder(attempt, signal),
    enabled: Boolean(user && attempt),
    refetchInterval: (entry) =>
      entry.state.data?.status === "pending" ? 1000 : false,
    retry: 1,
  });
  const saved = getOrderAttempt(user?.id);
  const retry = useMutation({
    mutationFn: () => {
      if (!saved || saved.key !== attempt)
        throw new Error("Tentativa não disponível.");
      return submitOrder(saved.key, saved.payload);
    },
    retry: false,
    onError: (error) => {
      if (
        user &&
        isAxiosError(error) &&
        (error.response?.status === 409 || error.response?.status === 422)
      )
        clearOrderAttempt(user.id);
    },
    onSuccess: (order) => {
      if (isCartOwnerActive(client, user?.id))
        client.setQueryData(queryKeys.orders.attempt(user?.id, attempt), order);
    },
  });
  const order = query.data;
  useEffect(() => {
    if (!user || !order || order.status === "pending") return;
    if (getOrderAttempt(user.id)?.key === order.attemptKey)
      clearOrderAttempt(user.id);
    void client.invalidateQueries({
      queryKey: queryKeys.cart.current(user.id),
    });
    void client.invalidateQueries({ queryKey: queryKeys.nfts.all });
    void client.invalidateQueries({ queryKey: queryKeys.quotes.all });
  }, [user, order, client]);
  if (!attempt)
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-xl font-bold">
          Selecione um pedido para consultar.
        </h1>
        <Link to="/carrinho" className="text-primary underline">
          Voltar ao carrinho
        </Link>
      </div>
    );
  if (query.isPending)
    return (
      <div role="status" className="space-y-4 p-6">
        <p>Consultando pedido...</p>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  if (query.isError || !order)
    return (
      <div role="alert" className="space-y-4 p-6">
        <p>{cartErrorMessage(query.error)}</p>
        <Button
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          Consultar novamente
        </Button>
        {saved?.key === attempt && (
          <Button disabled={retry.isPending} onClick={() => retry.mutate()}>
            Reenviar mesma tentativa
          </Button>
        )}
        {retry.error && <p>{cartErrorMessage(retry.error)}</p>}
        <Link to="/carrinho" className="block text-primary underline">
          Voltar ao carrinho
        </Link>
      </div>
    );
  if (order.status === "pending")
    return (
      <div role="status" className="space-y-5 p-6">
        <h1 className="text-xl font-bold">Pagamento pendente</h1>
        <p>
          Seu pedido está sendo processado. Aguarde a confirmação do pagamento.
        </p>
        <p className="break-all text-sm">Pedido: {order.id}</p>
        <Skeleton className="h-40 w-full" />
        <Button
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          Consultar estado
        </Button>
      </div>
    );
  if (order.status === "declined")
    return (
      <div role="alert" className="space-y-5 p-6">
        <h1 className="text-xl font-bold">Pagamento recusado</h1>
        <p>{order.reason}</p>
        <p>Seus itens foram preservados.</p>
        <Link to="/carrinho" className="text-primary underline">
          Revisar carrinho
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-144.5">
      <OrderReceipt
        items={order.items}
        summary={order.summary}
        receipt={{
          transaction: order.transaction!,
          date: new Date(order.updatedAt)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ (\d{4})$/, ", $1"),
          wallet: order.wallet.name,
          network: order.wallet.network,
        }}
      />
    </div>
  );
};
export const Route = createFileRoute("/confirmacao-pedido/")({
  beforeLoad: requireSession,
  validateSearch: (search: Record<string, unknown>) => ({
    attempt: typeof search.attempt === "string" ? search.attempt : "",
  }),
  component: Page,
});

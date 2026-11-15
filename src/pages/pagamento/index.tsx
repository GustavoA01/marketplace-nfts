import { useSyncExternalStore } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { requireSession } from "@/features/Auth/utils/navigation";
import { cartErrorMessage } from "@/lib/cart-query";
import { CheckoutDesktop } from "./-components/CheckoutDesktop";
import { CheckoutForm } from "./-components/CheckoutForm";
import { CheckoutItems } from "./-components/CheckoutItems";
import { CheckoutMobile } from "./-components/CheckoutMobile";
import { CheckoutReview } from "./-components/CheckoutReview";
import { CheckoutShell } from "./-components/CheckoutShell";
import { useCheckout } from "./-hooks/useCheckout";

const subscribeDesktop = (notify: () => void) => {
  const media = window.matchMedia("(min-width: 1024px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

const Page = () => {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
  const state = useCheckout();
  const {
    cart,
    wallets,
    profile,
    quote,
    form,
    selected,
    connected,
    reviewed,
    busy,
  } = state;
  const loading = cart.isPending || wallets.isPending || profile.isPending;
  const error = cart.error ?? wallets.error ?? profile.error;

  const walletBusy = busy || state.connectionMutation.isPending;
  const walletProps = {
    wallets: state.compatibleWallets,
    network: state.network,
    selectedId: selected?.id,
    connected,
    disabled: walletBusy,
    connecting: state.connectionMutation.isPending,
    onSelect: state.onSelect,
    onConnect: state.onConnect,
    onDisconnect: state.onDisconnect,
  };

  if (loading) {
    return (
      <CheckoutShell>
        <div role="status" className="space-y-5">
          <span className="sr-only">Carregando pagamento</span>
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </CheckoutShell>
    );
  }

  if (error) {
    return (
      <CheckoutShell>
        <div role="alert" className="space-y-4">
          <p>{cartErrorMessage(error)}</p>
          <Button
            onClick={() => {
              void cart.refetch();
              void wallets.refetch();
              void profile.refetch();
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </CheckoutShell>
    );
  }

  if (!cart.data?.items.length) {
    return (
      <CheckoutShell>
        <div className="space-y-4 py-8">
          <p>Seu carrinho está vazio.</p>
          <Link to="/" hash="catalogo" className="text-primary underline">
            Explorar NFTs
          </Link>
        </div>
      </CheckoutShell>
    );
  }

  if (state.networkError) {
    return (
      <CheckoutShell>
        <div role="alert" className="space-y-4 py-8">
          <p>{state.networkError}</p>
          <Button nativeButton={false} render={<Link to="/carrinho" />}>
            Revisar carrinho
          </Button>
        </div>
      </CheckoutShell>
    );
  }

  const collectorForm = (
    <CheckoutForm
      wallet={selected}
      wallets={state.compatibleWallets}
      onWalletChange={state.onSelect}
      register={form.register}
      errors={form.formState.errors}
      disabled={walletBusy}
    />
  );

  const disableConfirm =
    walletBusy ||
    !connected ||
    !quote.data ||
    reviewed !== quote.data.id ||
    quote.isFetching ||
    quote.isError ||
    cart.isFetching ||
    Boolean(state.pendingAttempt);

  const items = <CheckoutItems items={cart.data.items} />;

  const review = (
    <CheckoutReview
      quote={quote.data}
      pending={quote.isPending}
      error={quote.isError ? cartErrorMessage(quote.error) : undefined}
      reviewed={Boolean(quote.data && reviewed === quote.data.id)}
      disabled={busy || quote.isFetching}
      hasWallet={Boolean(selected)}
      onReview={(checked) =>
        state.setReviewed(checked ? (quote.data?.id ?? "") : "")
      }
      onRetry={() => void quote.refetch()}
    />
  );

  const submit = (
    <>
      {state.orderMutation.error && (
        <p role="alert" className="text-sm text-error">
          {cartErrorMessage(state.orderMutation.error)}
        </p>
      )}
      <Button
        type="submit"
        disabled={disableConfirm}
        className="h-15 w-full shrink-0 rounded-full text-base font-bold lg:h-11.25 lg:rounded-lg lg:text-[15px]"
      >
        {busy ? "Enviando pedido..." : "Confirmar compra"}
      </Button>
    </>
  );

  return (
    <CheckoutShell>
      {state.pendingAttempt && (
        <div
          role="status"
          className="my-6 space-y-3 rounded-lg border border-primary p-4"
        >
          <p>Existe uma tentativa de pagamento para consultar.</p>
          <Button
            nativeButton={false}
            render={
              <Link
                to="/confirmacao-pedido"
                search={{ attempt: state.pendingAttempt.key }}
              />
            }
          >
            Retomar pedido
          </Button>
        </div>
      )}
      <form
        noValidate
        onSubmit={state.onSubmit}
        className="flex min-h-[calc(100svh-140px)] flex-col gap-4 lg:min-h-0 lg:flex-row lg:items-start lg:gap-8"
      >
        {isDesktop ? (
          <CheckoutDesktop
            collectorForm={collectorForm}
            items={items}
            review={review}
            submit={submit}
            walletProps={walletProps}
          />
        ) : (
          <CheckoutMobile
            wallets={wallets.data ?? []}
            selectedId={selected?.id}
            connected={connected}
            busy={walletBusy}
            totalLabel={quote.data ? `${quote.data.summary.total} ETH` : "—"}
            collectorForm={collectorForm}
            items={items}
            review={review}
            submit={submit}
            walletProps={walletProps}
            onSelect={state.onSelect}
          />
        )}
      </form>
    </CheckoutShell>
  );
};

export const Route = createFileRoute("/pagamento/")({
  beforeLoad: requireSession,
  component: Page,
});

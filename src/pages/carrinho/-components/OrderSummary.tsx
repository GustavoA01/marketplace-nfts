import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderTotals } from "@/components/OrderTotals";
import type { Quote } from "@/data/types/quote";
import { CouponField } from "./CouponField";

type OrderSummaryProps = {
  onCheckout: () => void;
  subtotal: string;
  couponCode: string | null;
  isBusy: boolean;
  quote?: Quote;
  isQuotePending: boolean;
  isQuoteFetching: boolean;
  quoteError?: string;
  couponError?: string;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onRetryQuote?: () => void;
};

export const OrderSummary = ({
  onCheckout,
  subtotal,
  couponCode,
  isBusy,
  quote,
  isQuotePending,
  isQuoteFetching,
  quoteError,
  couponError,
  onApplyCoupon,
  onRemoveCoupon,
  onRetryQuote,
}: OrderSummaryProps) => (
  <section
    className="rounded-t-[32px] bg-surface-card p-6 lg:rounded-none lg:bg-transparent lg:p-0"
    aria-busy={isBusy || isQuoteFetching}
  >
    <h2 className="mb-5 border-b border-border pb-4 text-[17px] leading-4 font-bold">
      Resumo do carrinho
    </h2>
    <div className="space-y-4">
      <CouponField
        key={couponCode ?? "none"}
        appliedCode={couponCode}
        disabled={isBusy}
        error={couponError}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
      />
      {quoteError ? (
        <div role="alert" className="space-y-3 text-sm">
          <p>{quoteError}</p>
          <p>Subtotal: {subtotal} ETH</p>
          {onRetryQuote && (
            <Button
              type="button"
              variant="outline"
              disabled={isQuoteFetching}
              onClick={onRetryQuote}
            >
              Recalcular valores
            </Button>
          )}
        </div>
      ) : isQuotePending || !quote ? (
        <div role="status" className="space-y-4">
          <span className="sr-only">Calculando valores</span>
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      ) : (
        <>
          <OrderTotals
            summary={quote.summary}
            discountUnit="ETH"
            discountLabel="Desconto"
          />
          <p className="text-xs text-text-secondary">
            Rede estimada:{" "}
            {quote.network.charAt(0).toUpperCase() + quote.network.slice(1)}
          </p>
        </>
      )}
      {isQuoteFetching && !isQuotePending && (
        <p role="status" className="text-sm text-text-secondary">
          Atualizando valores...
        </p>
      )}
      <Button
        type="button"
        onClick={onCheckout}
        disabled={isBusy || isQuoteFetching || Boolean(quoteError) || !quote}
        className="h-[60px] w-full rounded-full text-[15px] font-bold lg:h-10 lg:rounded-sm"
      >
        Conectar e finalizar
      </Button>

      <Link
        to="/"
        hash="catalogo"
        className="block text-center text-[15px] text-text-accent hover:underline"
      >
        Continuar explorando
      </Link>
    </div>
  </section>
);

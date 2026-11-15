import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderTotals } from "@/components/OrderTotals";
import type { Quote } from "@/data/types/quote";
type Props = {
  quote?: Quote;
  pending: boolean;
  error?: string;
  reviewed: boolean;
  disabled: boolean;
  hasWallet: boolean;
  onReview: (checked: boolean) => void;
  onRetry: () => void;
};
export const CheckoutReview = ({
  quote,
  pending,
  error,
  reviewed,
  disabled,
  hasWallet,
  onReview,
  onRetry,
}: Props) => {
  if (!hasWallet)
    return (
      <p className="text-sm text-secondary">
        Selecione uma carteira para calcular os valores.
      </p>
    );
  if (pending) return <Skeleton className="h-40 w-full" />;
  if (error)
    return (
      <div role="alert" className="space-y-3">
        <p>{error}</p>
        <Button type="button" variant="outline" onClick={onRetry}>
          Recalcular valores
        </Button>
      </div>
    );
  if (!quote) return null;
  return (
    <div className="space-y-4">
      <OrderTotals
        summary={quote.summary}
        discountUnit="ETH"
        discountLabel="Desconto do lançamento"
      />
      <Label
        htmlFor="checkout-review"
        className="flex items-start gap-3 text-xs leading-5 font-normal"
      >
        <Input
          id="checkout-review"
          type="checkbox"
          checked={reviewed}
          disabled={disabled}
          onChange={(event) => onReview(event.target.checked)}
          className="mt-0.5 size-4 shrink-0"
        />
        Revisei os itens, a carteira e o total desta compra.
      </Label>
    </div>
  );
};

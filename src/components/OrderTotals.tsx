import type { PriceSummary } from "@/data/types/purchase";

type OrderTotalsProps = {
  summary: PriceSummary;
  discountUnit?: "ETH";
  discountLabel?: string;
};

export const OrderTotals = ({
  summary,
  discountUnit,
  discountLabel = "Desconto do lançamento",
}: OrderTotalsProps) => {
  return (
    <div className="space-y-3 text-[15px]">
      <div className="flex justify-between gap-4">
        <span>Subtotal</span>
        <span className="text-lg leading-5">{summary.subtotal} ETH</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>{discountLabel}</span>
        <span>
          (-) {summary.discount}
          {discountUnit && ` ${discountUnit}`}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span>Taxa de rede</span>
          <span className="text-lg leading-5">{summary.networkFee} ETH</span>
        </div>
        <p className="text-right text-xs leading-4 text-text-accent">
          Taxa estimada
        </p>
      </div>

      <div className="flex justify-between gap-4 border-t border-border pt-4 font-bold">
        <span className="text-base">Total</span>
        <span className="text-lg text-text-accent">{summary.total} ETH</span>
      </div>
    </div>
  );
};

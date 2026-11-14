import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import type { PriceSummary } from "@/data/types/purchase";
import { OrderTotals } from "@/components/OrderTotals";
import { CouponField } from "./CouponField";

type OrderSummaryProps = { summary: PriceSummary; couponId?: string };

export const OrderSummary = ({ summary, couponId }: OrderSummaryProps) => {
  return (
    <section className="rounded-t-[32px] bg-surface-card p-6 lg:rounded-none lg:bg-transparent lg:p-0">
      <h2 className="mb-5 hidden border-b border-border pb-4 text-[17px] leading-4 font-bold lg:block">
        Resumo da carteira
      </h2>
      <div className="space-y-4">
        <CouponField id={couponId} />
        <OrderTotals summary={summary} />
        <Button
          nativeButton={false}
          render={<Link to="/pagamento" />}
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
};

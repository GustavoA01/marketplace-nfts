import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import type { ReactNode } from "react";

export const CheckoutShell = ({ children }: { children: ReactNode }) => (
  <div className="mb-16 px-7 pt-8 lg:mb-24 lg:px-0 lg:pt-0">
    <PurchaseBreadcrumb
      title="Pagamento"
      mobileTitle="Pagamento com carteira"
      backTo="/carrinho"
    />
    {children}
  </div>
);

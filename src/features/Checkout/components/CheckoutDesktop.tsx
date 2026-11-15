import type { ComponentProps, ReactNode } from "react";
import { WalletOptions } from "./WalletOptions";

type CheckoutDesktopProps = {
  collectorForm: ReactNode;
  items: ReactNode;
  review: ReactNode;
  submit: ReactNode;
  walletProps: ComponentProps<typeof WalletOptions>;
};

export const CheckoutDesktop = ({
  collectorForm,
  items,
  review,
  submit,
  walletProps,
}: CheckoutDesktopProps) => (
  <>
    <div className="min-w-0 flex-1">{collectorForm}</div>
    <aside className="w-101.25 shrink-0 space-y-3">
      {items}
      {review}
      <div className="pt-1">
        <WalletOptions {...walletProps} />
      </div>
      <div className="pt-1">{submit}</div>
    </aside>
  </>
);

import type { ComponentProps, ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import type { Wallet } from "@/data/types/wallets";
import { SavedWallets } from "./SavedWallets";
import { WalletOptions } from "./WalletOptions";

type CheckoutMobileProps = {
  wallets: Wallet[];
  selectedId?: string;
  connected: boolean;
  busy: boolean;
  totalLabel: string;
  collectorForm: ReactNode;
  items: ReactNode;
  review: ReactNode;
  submit: ReactNode;
  walletProps: ComponentProps<typeof WalletOptions>;
  onSelect: (walletId: string) => void;
};

export const CheckoutMobile = ({
  wallets,
  selectedId,
  connected,
  busy,
  totalLabel,
  collectorForm,
  items,
  review,
  submit,
  walletProps,
  onSelect,
}: CheckoutMobileProps) => (
  <>
    <div className="mb-0 flex items-center justify-between gap-3 text-base leading-4 font-bold">
      <h2>{connected ? "Carteira conectada" : "Carteiras cadastradas"}</h2>
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-sm text-text-accent"
        onClick={() =>
          document.getElementById(`checkout-saved-${wallets[0]?.id}`)?.focus()
        }
      >
        Trocar carteira
      </Button>
    </div>
    <SavedWallets
      wallets={wallets}
      selectedId={selectedId}
      disabled={busy}
      onSelect={onSelect}
    />
    <WalletOptions {...walletProps} />
    <p className="mt-0 text-right text-base font-bold">
      Total: <span className="ml-5 text-xl text-text-accent">{totalLabel}</span>
    </p>
    <Accordion className="mt-2 mb-4">
      <AccordionItem value="collector-review">
        <AccordionTrigger className="py-5 text-sm font-normal text-text-secondary hover:no-underline">
          Dados do colecionador e revisão
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6">
          <div className="space-y-6">
            {collectorForm}
            {items}
            {review}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <div className="mt-auto space-y-3">{submit}</div>
  </>
);

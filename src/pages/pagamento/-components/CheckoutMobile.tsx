import { type ComponentProps, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
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
    <h2 className="mb-0 text-base leading-4 font-bold">
      {connected ? "Carteira conectada" : "Carteiras cadastradas"}
    </h2>
    <SavedWallets
      wallets={wallets.filter((wallet) => wallet.id === selectedId)}
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

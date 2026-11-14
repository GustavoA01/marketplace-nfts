import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { NFTLineItem } from "@/components/NFTLineItem";
import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import { OrderTotals } from "@/components/OrderTotals";
import { CheckoutForm } from "../components/CheckoutForm";
import { WalletOptions } from "../components/WalletOptions";
import {
  cartSummaryMock,
  mobileCartSummaryMock,
  checkoutItemsMock,
  collectorWalletsMock,
} from "@/data/mocks/temporary/purchase";

export const Checkout = () => {
  return (
    <div className="mb-16 px-7 pt-8 lg:mb-24 lg:px-0 lg:pt-0">
      <PurchaseBreadcrumb
        title="Pagamento"
        mobileTitle="Pagamento com carteira"
        backTo="/carrinho"
      />
      <div className="hidden items-start gap-8 lg:flex">
        <div className="min-w-0 flex-1">
          <CheckoutForm />
        </div>
        <aside className="w-101.25 shrink-0 space-y-4">
          <h2 className="text-[17px] leading-5 font-bold">Seus NFTs</h2>
          <div className="flex justify-between border-b border-border pb-3 text-base leading-4">
            <span className="font-bold">NFTs</span>
            <span>Subtotal</span>
          </div>
          <div className="space-y-3">
            {checkoutItemsMock.map((item) => (
              <NFTLineItem key={item.id} item={item} />
            ))}
          </div>
          <p className="text-center text-sm">
            Tem um código promocional? Aplique aqui
          </p>
          <OrderTotals summary={cartSummaryMock} />
          <WalletOptions wallets={collectorWalletsMock} />
          <Button
            type="button"
            className="mt-2 h-[45px] w-full rounded-sm text-base font-bold"
          >
            Confirmar compra
          </Button>
        </aside>
      </div>
      <div className="flex min-h-[calc(100svh-140px)] flex-col lg:hidden">
        <WalletOptions wallets={collectorWalletsMock} mobile />
        <p className="mt-5 text-right text-base font-bold">
          Total:{" "}
          <span className="ml-3 text-xl text-text-accent">
            {mobileCartSummaryMock.total} ETH
          </span>
        </p>
        <Accordion className="mt-8 mb-8">
          <AccordionItem value="collector-review">
            <AccordionTrigger className="py-5 text-sm font-normal text-text-secondary hover:no-underline">
              Dados do colecionador e revisão
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="space-y-6">
                <CheckoutForm idPrefix="mobile-checkout" />
                <div className="space-y-3">
                  {checkoutItemsMock.map((item) => (
                    <NFTLineItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          type="button"
          className="mt-auto h-15 w-full shrink-0 rounded-full text-base font-bold"
        >
          Confirmar compra
        </Button>
      </div>
    </div>
  );
};

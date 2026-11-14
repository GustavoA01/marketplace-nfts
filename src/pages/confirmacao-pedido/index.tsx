import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Checkout } from "@/features/Checkout/container/Checkout";
import {
  cartSummaryMock,
  receiptItemsMock,
  receiptMock,
} from "@/data/mocks/temporary/purchase";
import { OrderReceipt } from "./-components/OrderReceipt";

const Page = () => {
  const navigate = useNavigate();
  return (
    <>
      <Checkout />
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) void navigate({ to: "/pagamento" });
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[92svh] max-w-144.5 gap-0 overflow-y-auto rounded-none p-0 sm:max-w-[578px]"
        >
          <DialogTitle className="sr-only">
            Prévia de confirmação do pedido
          </DialogTitle>
          <OrderReceipt
            items={receiptItemsMock}
            summary={cartSummaryMock}
            receipt={receiptMock}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const Route = createFileRoute("/confirmacao-pedido/")({
  beforeLoad: requireSession,
  component: Page,
});

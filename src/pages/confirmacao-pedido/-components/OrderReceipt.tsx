import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NFTLineItem } from "@/components/NFTLineItem";
import type { PriceSummary, PurchaseItem } from "@/data/types/purchase";

type OrderReceiptProps = {
  items: PurchaseItem[];
  summary: PriceSummary;
  receipt: {
    transaction: string;
    date: string;
    wallet: string;
    network: string;
  };
};

export const OrderReceipt = ({
  items,
  summary,
  receipt,
}: OrderReceiptProps) => {
  return (
    <div className="relative border-b-[10px] border-primary bg-surface-card">
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        render={<Link to="/pagamento" />}
        className="absolute top-3 right-3 size-6 text-primary"
      >
        <X className="size-4" />
        <span className="sr-only">Fechar recibo</span>
      </Button>
      <div className="flex min-h-[156px] flex-col items-center justify-center gap-4 px-6 py-5">
        <img src="/icons/ThankYou.svg" alt="Obrigado" />
        <h1 className="text-center text-base leading-6 font-bold text-text-secondary">
          Seus NFTs agora estão na sua carteira
        </h1>
      </div>
      <p className="border-y border-primary px-4 py-2 text-center text-xs leading-4 text-text-secondary">
        Prévia com dados demonstrativos. Nenhuma compra foi realizada.
      </p>
      <dl className="grid grid-cols-2 gap-4 border-b border-primary px-6 py-4 text-sm leading-4 text-text-secondary sm:grid-cols-4 lg:px-9">
        {[
          { label: "ID da transação", value: receipt.transaction },
          { label: "Data", value: receipt.date },
          { label: "Total", value: `${summary.total} ETH` },
          { label: "Carteira", value: receipt.wallet },
        ].map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="mb-1 font-bold">{label}</dt>
            <dd className="break-words">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="px-5 pt-6 pb-6 sm:px-11">
        <h2 className="mb-3 text-base font-bold">Detalhes da transação</h2>
        <div className="mb-3 flex justify-between border-b border-border pb-3 text-base font-bold">
          <span>NFTs</span>
          <div className="flex gap-8">
            <span className="hidden sm:block">Edições</span>
            <span>Subtotal</span>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <NFTLineItem key={item.id} item={item} receipt />
          ))}
        </div>
        <div className="mt-5 space-y-3 text-base">
          <p className="flex justify-end gap-8">
            Taxa de rede{" "}
            <span className="text-lg">{summary.networkFee} ETH</span>
          </p>
          <p className="flex justify-end gap-8 font-bold">
            Total{" "}
            <span className="text-lg text-text-accent">
              {summary.total} ETH
            </span>
          </p>
        </div>
        <p className="mt-3 border-t border-border pt-4 text-center text-sm leading-[22px] text-text-secondary">
          Transação confirmada na {receipt.network}. A propriedade foi
          transferida para sua carteira conectada e registrada na rede.
        </p>
        <Button
          type="button"
          className="mx-auto mt-6 flex h-12 rounded-md px-4 text-base font-bold"
        >
          Ver no Etherscan
        </Button>
      </div>
    </div>
  );
};

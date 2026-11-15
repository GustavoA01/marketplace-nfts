import { OrderTotals } from "@/components/OrderTotals";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NFTLineItem } from "@/components/NFTLineItem";
import type { PriceSummary, PurchaseItem } from "@/data/types/purchase";

const explorers: Partial<
  Record<string, { name: string; network: string; url: string }>
> = {
  ethereum: {
    name: "Etherscan",
    network: "Ethereum",
    url: "https://etherscan.io/tx/",
  },
  polygon: {
    name: "Polygonscan",
    network: "Polygon",
    url: "https://polygonscan.com/tx/",
  },
  solana: {
    name: "Solana Explorer",
    network: "Solana",
    url: "https://explorer.solana.com/tx/",
  },
};

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
  const explorer = explorers[receipt.network];
  const transaction =
    receipt.transaction.length > 11
      ? `${receipt.transaction.slice(0, 6)}…${receipt.transaction.slice(-4)}`
      : receipt.transaction;

  return (
    <div className="relative border-b-[10px] border-primary bg-surface-card">
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        render={<Link to="/" />}
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
      <dl className="grid grid-cols-2 gap-4 border-y border-primary px-6 py-4 text-sm leading-4 text-text-secondary sm:grid-cols-[1.2fr_1.1fr_1fr_1fr] lg:px-9">
        {[
          {
            label: "ID da transação",
            value: transaction,
            title: receipt.transaction,
          },
          { label: "Data", value: receipt.date },
          { label: "Total", value: `${summary.total} ETH` },
          { label: "Carteira", value: receipt.wallet },
        ].map(({ label, value, title }) => (
          <div key={label} className="min-w-0">
            <dt className="mb-1 font-bold whitespace-nowrap">{label}</dt>
            <dd className="truncate" title={title ?? value}>
              {value}
            </dd>
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
        <div className="mt-5">
          <OrderTotals
            summary={summary}
            discountUnit="ETH"
            discountLabel="Desconto"
          />
        </div>
        <p className="mt-3 border-t border-border pt-4 text-center text-sm leading-[22px] text-text-secondary">
          Transação confirmada na {explorer?.network ?? receipt.network}. A
          propriedade foi transferida para sua carteira conectada e registrada
          na rede.
        </p>
        {explorer && (
          <Button
            nativeButton={false}
            render={
              <a
                href={`${explorer.url}${encodeURIComponent(receipt.transaction)}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            className="mx-auto mt-6 flex h-12 rounded-md px-4 text-base font-bold"
          >
            Ver no {explorer.name}
          </Button>
        )}
      </div>
    </div>
  );
};

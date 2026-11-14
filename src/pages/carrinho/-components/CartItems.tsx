import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import type { PurchaseItem } from "@/data/types/purchase";

export const CartItems = ({ items }: { items: PurchaseItem[] }) => {
  return (
    <div>
      <div className="mb-3 hidden items-center justify-between border-b border-border pr-6 pb-3 text-base leading-4 lg:flex">
        <span className="w-62.5 font-bold">NFTs</span>
        <span className="w-19.25">Preço</span>
        <span className="w-18.75 font-bold">Edições</span>
        <span className="w-21.75">Total</span>
        <span className="w-6" />
      </div>
      <div className="space-y-5 lg:space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-surface-card lg:justify-between lg:gap-2 lg:rounded-none lg:pr-6"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 lg:w-62.5 lg:flex-none lg:gap-4">
              <img
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="size-25 shrink-0 rounded-2xl object-cover lg:size-17.5 lg:rounded-md"
              />
              <div className="min-w-0 py-3">
                <h2 className="text-xs leading-4 font-bold sm:text-sm sm:leading-5 lg:text-base lg:leading-4">
                  {item.name}
                </h2>
                <p className="mt-1 hidden text-sm leading-4 text-secondary lg:block">
                  ID do token: {item.token}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-text-secondary sm:text-sm lg:hidden">
                  Edição: {item.edition}
                </p>
                <p className="mt-2 text-sm leading-4 font-bold text-text-accent sm:mt-3 sm:text-base lg:hidden">
                  {item.total} ETH
                </p>
              </div>
            </div>
            <span className="hidden w-[77px] text-base leading-4 font-bold text-text-secondary lg:block">
              {item.price} ETH
            </span>
            <div className="pr-2 sm:pr-3 lg:pr-0">
              <QuantitySelector value={item.quantity} />
            </div>

            <span className="hidden w-[87px] text-base leading-4 font-bold text-text-accent lg:block">
              {item.total} ETH
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden size-6 text-secondary lg:flex"
            >
              <Trash2 className="size-5" />
              <span className="sr-only">Remover {item.name}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

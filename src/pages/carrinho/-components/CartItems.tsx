import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import type { CartItem } from "@/data/types/cart";

type CartItemsProps = {
  items: CartItem[];
  disabled: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export const CartItems = ({
  items,
  disabled,
  onQuantityChange,
  onRemove,
}: CartItemsProps) => (
  <div>
    <div className="mb-3 hidden items-center justify-between border-b border-border pr-6 pb-3 text-base leading-4 lg:flex">
      <span className="w-62.5 font-bold">NFTs</span>
      <span className="w-24">Preço</span>
      <span className="w-21.75 font-bold">Quantidade</span>
      <span className="w-21.75">Total</span>
      <span className="w-6" />
    </div>
    <div className="space-y-5 lg:space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex items-center gap-3 rounded-2xl bg-surface-card lg:justify-between lg:gap-2 lg:rounded-none lg:pr-6"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:w-62.5 lg:flex-none lg:gap-4">
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.nftId }}
              className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={item.image}
                alt={item.imageDescription}
                width={100}
                height={100}
                className="size-25 rounded-2xl object-cover lg:size-17.5 lg:rounded-md"
              />
            </Link>
            <div className="min-w-0 py-3">
              <h2 className="text-xs leading-4 font-bold sm:text-sm sm:leading-5 lg:text-base lg:leading-4">
                {item.name}
              </h2>
              <p className="mt-1 text-[11px] leading-4 text-text-secondary sm:text-sm">
                Edição: {item.edition}
              </p>
              {!item.isAvailable && (
                <p role="status" className="mt-2 text-xs text-error">
                  {item.maxQuantity < 1
                    ? "Edição indisponível. Remova este item."
                    : `Ajuste a quantidade para até ${item.maxQuantity}.`}
                </p>
              )}
              <p className="mt-2 text-sm leading-4 font-bold text-text-accent sm:mt-3 sm:text-base lg:hidden">
                {item.lineTotal} ETH
              </p>
            </div>
          </div>
          <span className="hidden w-24 whitespace-nowrap text-base leading-4 font-bold text-text-secondary lg:block">
            {item.unitPrice} ETH
          </span>
          <div className="flex shrink-0 flex-col items-center gap-2 pr-2 lg:contents">
            <QuantitySelector
              value={item.quantity}
              max={item.maxQuantity}
              disabled={disabled || item.maxQuantity < 1}
              onDecrease={() =>
                onQuantityChange(
                  item.id,
                  Math.min(item.quantity - 1, item.maxQuantity),
                )
              }
              onIncrease={() => onQuantityChange(item.id, item.quantity + 1)}
            />
            <span className="hidden w-21.75 whitespace-nowrap text-base leading-4 font-bold text-text-accent lg:block">
              {item.lineTotal} ETH
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              onClick={() => onRemove(item.id)}
              className="size-7 text-secondary lg:size-6"
            >
              <Trash2 className="size-5" />
              <span className="sr-only">
                Remover {item.name}, edição {item.edition}
              </span>
            </Button>
          </div>
        </article>
      ))}
    </div>
  </div>
);

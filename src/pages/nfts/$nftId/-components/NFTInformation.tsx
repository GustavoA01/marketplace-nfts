import { FavoriteButton } from "@/features/Favorites/container/FavoriteButton";
import { Mail, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import type { NFTDetail } from "@/data/types/catalogue";
import { cn } from "@/lib/utils";

type NFTInformationProps = {
  nft: NFTDetail;
  selectedEdition: string;
  quantity: number;
  maxQuantity: number;
  disabled: boolean;
  isAdding: boolean;
  onBuy: () => void;
  onAddToCart: () => void;
  onEditionChange: (edition: string) => void;
  onQuantityChange: (quantity: number) => void;
};

export const NFTInformation = ({
  nft,
  selectedEdition,
  quantity,
  maxQuantity,
  disabled,
  isAdding,
  onBuy,
  onAddToCart,
  onEditionChange,
  onQuantityChange,
}: NFTInformationProps) => {
  return (
    <div className="relative -mt-[114px] flex min-w-0 flex-1 flex-col gap-5 rounded-t-[32px] bg-surface-card p-6 lg:mt-0 lg:min-h-[448px] lg:justify-between lg:gap-3 lg:rounded-none lg:bg-transparent lg:p-0">
      <div className="border-b border-border pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl leading-7 font-bold lg:text-[28px] lg:leading-9">
            {nft.name}
          </h1>
          {nft.rating !== undefined && (
            <span className="flex items-center gap-1 rounded-full border border-primary px-2 text-sm text-text-secondary lg:hidden">
              <Star className="size-3 fill-primary text-primary" />
              {nft.rating} ({nft.reviews})
            </span>
          )}
        </div>
        <div className="mt-3 hidden flex-wrap items-center justify-between gap-3 lg:flex">
          <span className="text-[22px] leading-4 font-bold text-text-accent">
            {nft.price} ETH
          </span>
          {nft.reviews !== undefined && (
            <span className="flex items-center gap-1 text-[13px]">
              {[0, 1, 2, 3, 4].map((index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-[15px] fill-primary text-primary",
                    index === 4 && "fill-secondary text-secondary",
                  )}
                />
              ))}
              {nft.reviews} avaliações de colecionadores
            </span>
          )}
        </div>
      </div>
      <div>
        <h2 className="mb-3 hidden text-[15px] leading-4 font-bold lg:block">
          Sobre este NFT:
        </h2>
        <p className="text-sm leading-6 text-text-secondary">
          {nft.description}
        </p>
      </div>
      <div>
        <h2 className="mb-3 text-[15px] leading-4 font-bold">Edição:</h2>
        {!nft.editions.length && (
          <p role="status" className="text-sm text-text-secondary">
            Não há edições disponíveis.
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {nft.editions.map((edition) => (
            <Button
              key={edition}
              aria-pressed={edition === selectedEdition}
              disabled={disabled || !nft.editionAvailability[edition]}
              onClick={() => onEditionChange(edition)}
              type="button"
              variant="outline"
              className={cn(
                "h-7 rounded-full border-border px-2 text-sm leading-4 font-normal text-text-secondary dark:bg-transparent",
                edition === selectedEdition &&
                  "border-primary text-text-accent",
              )}
            >
              {edition}
              {!nft.editionAvailability[edition] && " (esgotada)"}
            </Button>
          ))}
        </div>
      </div>
      <div className="hidden flex-wrap items-center justify-between gap-3 lg:flex">
        <QuantitySelector
          value={quantity}
          max={maxQuantity}
          disabled={disabled || maxQuantity < 1}
          size="large"
          onDecrease={() => onQuantityChange(quantity - 1)}
          onIncrease={() => onQuantityChange(quantity + 1)}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            disabled={disabled || maxQuantity < 1 || !selectedEdition}
            onClick={onBuy}
            className="h-10 w-[130px] rounded-md text-sm font-bold"
          >
            {isAdding ? "Adicionando..." : "COMPRAR"}
          </Button>
          <FavoriteButton
            nftId={nft.id}
            showLabel
            className="h-10 min-w-[130px] rounded-md border-primary text-sm text-text-accent"
          />
        </div>
      </div>
      <p role="status" className="text-sm text-text-secondary">
        {maxQuantity > 0
          ? `${maxQuantity} unidades disponíveis nesta edição`
          : "NFT esgotado"}
      </p>
      <div className="space-y-3 text-[15px] text-secondary">
        <p>ID do token: {nft.token}</p>
        <p>Coleção: {nft.collection}</p>
        <p>Atributos: {nft.attributes}</p>
        <p className="hidden items-center gap-2 font-bold text-foreground lg:flex">
          Compartilhar este NFT:
          <img src="/icons/linkedin.svg" alt="LinkedIn" className="size-4" />
          <img src="/icons/twitter.svg" alt="Twitter" className="size-4" />
          <Mail className="size-4" />
        </p>
      </div>
      <div className="mt-4 space-y-5 rounded-t-[32px] bg-surface-raised p-5 lg:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            Qtd.
            <QuantitySelector
              value={quantity}
              max={maxQuantity}
              disabled={disabled || maxQuantity < 1}
              onDecrease={() => onQuantityChange(quantity - 1)}
              onIncrease={() => onQuantityChange(quantity + 1)}
            />
          </div>
          <span className="text-xl font-bold text-text-accent">
            {nft.price} ETH
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            disabled={disabled || maxQuantity < 1 || !selectedEdition}
            onClick={onBuy}
            className="h-[60px] flex-1 rounded-full text-base font-bold"
          >
            {isAdding ? "Adicionando..." : "Comprar NFT"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled || maxQuantity < 1 || !selectedEdition}
            onClick={onAddToCart}
            className="size-[60px] rounded-full bg-surface-dark text-secondary"
          >
            <ShoppingCart className="size-5" />
            <span className="sr-only">Adicionar ao carrinho</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

import { Link } from "@tanstack/react-router";
import type { CartItem } from "@/data/types/cart";
export const CheckoutItems = ({ items }: { items: CartItem[] }) => (
  <section className="space-y-3">
    <h2 className="text-[17px] leading-4 font-bold">Seus NFTs</h2>
    <div className="flex justify-between border-b border-border pb-3 text-base leading-4">
      <span className="font-bold">NFTs</span>
      <span>Subtotal</span>
    </div>
    <div className="space-y-3">
      {items.map((item) => {
        const number = item.nftId.match(/-(\d+)$/)?.[1];
        return (
          <div
            key={item.id}
            className="flex min-h-17.5 items-center gap-2 bg-surface-card pr-3 pl-1"
          >
            <img
              src={item.image}
              alt={item.imageDescription}
              width={70}
              height={70}
              className="size-17.5 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1 space-y-1.5 py-2">
              <p
                className="truncate text-sm leading-4 font-bold xl:text-base"
                title={item.name}
              >
                {item.name}
              </p>
              <p className="truncate text-xs leading-4 text-secondary xl:text-sm">
                ID do token:{" "}
                {number ? `#${number.padStart(4, "0")}` : item.nftId}
              </p>
            </div>
            <span className="shrink-0 text-xs text-text-secondary">
              (x {item.quantity})
            </span>
            <span className="shrink-0 whitespace-nowrap text-sm leading-4 font-bold text-text-accent xl:text-lg">
              {item.lineTotal} ETH
            </span>
          </div>
        );
      })}
    </div>
    <p className="text-center text-sm">
      <Link
        to="/carrinho"
        hash="cart-coupon"
        className="underline-offset-4 hover:underline"
      >
        Tem um código promocional? Aplique aqui
      </Link>
    </p>
  </section>
);

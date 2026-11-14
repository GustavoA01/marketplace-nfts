import type { PurchaseItem } from "@/data/types/purchase";

type NFTLineItemProps = { item: PurchaseItem; receipt?: boolean };

export const NFTLineItem = ({ item, receipt = false }: NFTLineItemProps) => {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 bg-surface-card">
      <img
        src={item.image}
        alt={item.name}
        width={70}
        height={70}
        className="size-[70px] shrink-0 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 py-2">
        <p className="text-sm leading-5 font-bold lg:text-base lg:leading-5">
          {item.name}
        </p>
        <p className="text-xs leading-4 text-secondary lg:text-sm lg:leading-5">
          ID do token: {item.token}{" "}
          <span
            className={
              receipt ? "whitespace-nowrap sm:hidden" : "whitespace-nowrap"
            }
          >
            (x {item.quantity})
          </span>
        </p>
      </div>

      {receipt && (
        <span className="hidden shrink-0 text-sm text-text-secondary sm:block">
          (x {item.quantity})
        </span>
      )}
      <span className="shrink-0 text-sm leading-5 font-bold text-text-accent lg:text-lg">
        {item.total} ETH
      </span>
    </div>
  );
};

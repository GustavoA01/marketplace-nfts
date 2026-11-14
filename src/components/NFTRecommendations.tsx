import { NFTCard } from "@/components/NFTCard";
import { cn } from "@/lib/utils";
import type { NFTPreview } from "@/data/types/nft";

type NFTRecommendationsProps = {
  title: string;
  items: NFTPreview[];
  className?: string;
};

export const NFTRecommendations = ({
  title,
  items,
  className,
}: NFTRecommendationsProps) => {
  return (
    <section className={cn("mt-16 lg:mt-24", className)}>
      <h2 className="border-b border-border pb-3 text-[17px] leading-5 font-bold text-text-accent">
        {title}
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5 xl:gap-x-[26px]">
        {items.map((nft) => (
          <NFTCard key={nft.id} nft={nft} compact />
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "size-3 rounded-full border border-primary",
              index === 1 && "bg-primary",
            )}
          />
        ))}
      </div>
    </section>
  );
};

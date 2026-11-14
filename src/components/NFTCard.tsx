import { Link } from "@tanstack/react-router"
import { Heart } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import type { NFTPreview } from "@/data/types/nft"

type NFTCardProps = {
  nft: NFTPreview
  artworkClassName?: string
  detailsClassName?: string
}

export const NFTCard = ({ nft, artworkClassName, detailsClassName }: NFTCardProps) => {
  return (
    <Link to="/nfts/$nftId" params={{ nftId: nft.id }} className="block min-w-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="gap-2 overflow-visible rounded-none bg-transparent p-0 ring-0 lg:gap-3">
        <div className={cn(
          "relative flex h-50 justify-center overflow-hidden rounded-[20px] bg-linear-to-br from-surface-card to-surface-raised px-1 pt-3 lg:h-75 lg:rounded-none lg:bg-surface-card lg:bg-none lg:pt-6",
          nft.portrait && "lg:pl-5 lg:pr-3 lg:pt-1.5",
          artworkClassName,
        )}>
          <img
            src={nft.image}
            alt={nft.imageDescription}
            width={nft.portrait ? 224 : 250}
            height={nft.portrait ? 286 : 250}
            loading="lazy"
            className={cn("aspect-square h-fit w-full rounded-2xl object-cover lg:max-w-62.5 lg:rounded-[15px]", nft.portrait && "lg:h-71.5 lg:max-w-56 lg:rounded-[13px]")}
          />
          {nft.favorite && (
            <Heart
              className="absolute top-3 right-2 size-5 text-primary lg:hidden"
              strokeWidth={1.6}
              fill={nft.favorite === "filled" ? "currentColor" : "none"}
            />
          )}
          {nft.rare && <span className="absolute top-4 left-0 bg-primary px-2 py-2 text-[13px] leading-4 text-ink lg:hidden">RARO</span>}
        </div>

        {nft.name && (
          <div className={cn("flex flex-col gap-1.5 px-2 lg:px-0", detailsClassName)}>
            <h3 className="text-[15px] leading-5 font-normal lg:text-base lg:leading-4">{nft.name}</h3>
            {nft.price && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-4 font-bold text-text-accent lg:text-lg">
                <span>{nft.price} ETH</span>
                {nft.previousPrice && <span className="font-normal text-secondary">{nft.previousPrice} ETH</span>}
              </p>
            )}
          </div>
        )}
      </Card>
    </Link>
  )
}

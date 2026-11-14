import { Card } from "@/components/ui/Card"

type FeaturedNFTProps = { image: string }

export const FeaturedNFT = ({ image }: FeaturedNFTProps) => {
  return (
    <Card className="relative h-[470px] gap-4 overflow-hidden rounded-none bg-linear-to-b from-primary/10 to-primary/3 pt-6 pb-1 ring-0">
      <h3 className="px-5 text-2xl leading-8 font-bold text-text-accent">NFT EM DESTAQUE</h3>
      <p className="px-5 text-center text-[22px] leading-4 font-bold">OFERTA LIMITADA</p>
      <img src={image} alt="NFT em destaque: macaco com chapéu e moletom roxo" width={310} height={368} loading="lazy" className="h-[368px] w-full shrink-0 rounded-[22px] object-cover" />
      <span className="absolute top-[299px] left-4 size-[22px] rounded-[7px] border-2 border-success/20" />
      <span className="absolute top-[343px] right-[17px] size-[45px] rounded-full bg-linear-to-br from-primary/30 to-transparent" />
      <span className="absolute top-[105px] left-[38px] size-[15px] rounded-full bg-linear-to-br from-primary/30 to-transparent" />
    </Card>
  )
}

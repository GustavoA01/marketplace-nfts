import { Skeleton } from "@/components/ui/Skeleton";

export const NFTDetailSkeleton = () => (
  <div role="status" className="mb-16 lg:mb-24">
    <span className="sr-only">Carregando detalhes do NFT</span>
    <div className="flex flex-col lg:flex-row lg:gap-8">
      <Skeleton className="h-126.5 w-full rounded-3xl lg:h-111 lg:w-143.25" />
      <div className="relative -mt-[114px] flex-1 space-y-6 rounded-t-[32px] bg-surface-card p-6 lg:mt-0 lg:bg-transparent lg:p-0">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-2/3" />
      </div>
    </div>
    <Skeleton className="mt-12 h-40 w-full" />
  </div>
);

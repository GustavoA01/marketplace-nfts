import { Skeleton } from "@/components/ui/Skeleton";

export const CatalogueSkeleton = () => (
  <div
    role="status"
    className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 pb-8 md:grid-cols-3 md:pb-0 lg:gap-x-[34px] lg:gap-y-[72px]"
  >
    <span className="sr-only">Carregando NFTs</span>
    {Array.from({ length: 9 }, (_, index) => (
      <div
        key={index}
        className="min-w-0 space-y-3 even:translate-y-8 md:even:translate-y-0"
      >
        <Skeleton className="h-50 rounded-[20px] lg:h-75 lg:rounded-none" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

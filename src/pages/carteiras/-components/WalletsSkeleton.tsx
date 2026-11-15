import { Skeleton } from "@/components/ui/Skeleton";

export const WalletsSkeleton = () => (
  <div role="status" className="flex w-full flex-col gap-8">
    <span className="sr-only">Carregando carteiras</span>
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 md:gap-x-7">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="space-y-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-full rounded-[3px] sm:h-10" />
          </div>
        ))}
      </div>
      <Skeleton className="h-9 w-full rounded-full sm:h-10 sm:w-44 sm:rounded-[3px]" />
    </div>
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-3 w-64 max-w-full" />
    </div>
  </div>
);

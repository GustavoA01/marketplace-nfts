import { Skeleton } from "@/components/ui/Skeleton";

export const CartSkeleton = () => (
  <div role="status" className="flex flex-col gap-8 px-7 lg:px-0 xl:flex-row">
    <span className="sr-only">Carregando carrinho</span>
    <div className="flex-1 space-y-4">
      {[0, 1, 2].map((index) => (
        <Skeleton key={index} className="h-25 w-full" />
      ))}
    </div>
    <div className="w-full space-y-5 xl:w-83">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

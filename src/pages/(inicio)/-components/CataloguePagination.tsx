import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type CataloguePaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export const CataloguePagination = ({
  page,
  totalPages,
  onChange,
}: CataloguePaginationProps) => {
  if (totalPages < 2) return null;

  const first = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => first + index,
  );

  return (
    <nav className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="size-8.75 rounded-sm p-0"
      >
        <ChevronLeft className="size-4.5" strokeWidth={1.6} />
        <span className="sr-only">Página anterior</span>
      </Button>
      {pages.map((number) => (
        <Button
          type="button"
          key={number}
          aria-current={number === page ? "page" : undefined}
          variant={number === page ? "default" : "outline"}
          onClick={() => onChange(number)}
          className="size-8.75 rounded-sm p-0 text-lg leading-4"
        >
          {number}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="size-8.75 rounded-sm p-0"
      >
        <ChevronRight className="size-4.5" strokeWidth={1.6} />
        <span className="sr-only">Próxima página</span>
      </Button>
    </nav>
  );
};

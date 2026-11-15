import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

type PurchaseBreadcrumbProps = {
  title?: string;
  compact?: boolean;
  mobileTitle: string;
  backTo?: "/" | "/carrinho" | "/pagamento";
};

export const PurchaseBreadcrumb = ({
  title,
  mobileTitle,
  backTo = "/",
  compact = false,
}: PurchaseBreadcrumbProps) => {
  return (
    <div className={compact ? "mb-3" : "mb-3 lg:mb-8"}>
      <nav className="hidden items-center gap-2 text-[15px] leading-4 font-bold lg:flex">
        <Link to="/" className="hover:text-primary">
          Início
        </Link>
        <span>/</span>
        <Link to="/" hash="catalogo" className="hover:text-primary">
          Mercado
        </Link>
        {title && (
          <>
            <span>/</span>
            <span>{title}</span>
          </>
        )}
      </nav>
      <div className="flex min-h-11 items-center gap-4 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          nativeButton={false}
          render={<Link to={backTo} />}
          className="size-8.75 rounded-full bg-surface-raised text-secondary"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="flex-1 text-center text-lg leading-6 font-bold">
          {mobileTitle}
        </h1>
      </div>
    </div>
  );
};

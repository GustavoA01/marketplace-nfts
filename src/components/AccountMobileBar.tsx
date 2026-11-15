import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AccountMobileBarProps = {
  title: string;
  backTo?: "/" | "/carrinho" | "/pagamento";
  backLabel?: string;
};

export const AccountMobileBar = ({
  title,
  backTo = "/",
  backLabel = "Voltar",
}: AccountMobileBarProps) => {
  return (
    <div className="mb-4 flex min-h-11 items-center gap-4 lg:hidden">
      <Button
        variant="outline"
        size="icon"
        nativeButton={false}
        render={<Link to={backTo} />}
        className="size-[35px] rounded-full border-border bg-surface-raised text-secondary"
      >
        <ChevronLeft className="size-5" />
        <span className="sr-only">{backLabel}</span>
      </Button>
      <h1 className="flex-1 text-center font-mono text-lg leading-6 font-bold">
        {title}
      </h1>
    </div>
  );
};

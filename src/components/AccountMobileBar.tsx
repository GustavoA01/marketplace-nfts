import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AccountMobileBarProps = {
  title: string;
};

export const AccountMobileBar = ({ title }: AccountMobileBarProps) => {
  return (
    <div className="mb-4 flex min-h-11 items-center gap-4 lg:hidden">
      <Button
        variant="outline"
        size="icon"
        nativeButton={false}
        render={<Link to="/" />}
        className="size-[35px] rounded-full border-border bg-surface-raised text-secondary"
      >
        <ChevronLeft className="size-5" />
        <span className="sr-only">Voltar</span>
      </Button>
      <h1 className="flex-1 text-center font-mono text-lg leading-6 font-bold">
        {title}
      </h1>
    </div>
  );
};

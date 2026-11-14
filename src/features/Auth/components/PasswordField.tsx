import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "cn";

type PasswordFieldProps = Omit<ComponentProps<"input">, "type"> & {
  className?: string;
  visible: boolean;
  onToggleVisibility: () => void;
};

export const PasswordField = ({
  className,
  visible,
  onToggleVisibility,
  ...props
}: PasswordFieldProps) => {
  return (
    <div className="relative w-full">
      <Input
        type={visible ? "text" : "password"}
        className={cn(
          "h-10 rounded-[5px] border-border bg-transparent px-4 pr-10 font-mono text-sm placeholder:text-secondary",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      >
        {visible ? (
          <Eye className="size-4.5 text-secondary" strokeWidth={1.6} />
        ) : (
          <EyeOff className="size-4.5 text-secondary" strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
};

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
  value: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  size?: "small" | "large";
  onDecrease?: () => void;
  onIncrease?: () => void;
};

export const QuantitySelector = ({
  value,
  disabled = false,
  min = 1,
  max = Infinity,
  size = "small",
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) => {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center",
        size === "large" ? "gap-3" : "gap-2",
      )}
    >
      <Button
        type="button"
        size="icon"
        onClick={onDecrease}
        disabled={disabled || value <= min}
        className={cn(
          "size-7 rounded-full p-0",
          size === "large" && "size-12.5",
        )}
      >
        <Minus className={cn("size-3.5", size === "large" && "size-4")} />
        <span className="sr-only">Diminuir quantidade</span>
      </Button>
      <span
        className={cn(
          "min-w-4 text-center text-sm leading-5",
          size === "large" && "min-w-5 text-xl leading-6",
        )}
      >
        {value}
      </span>
      <Button
        type="button"
        size="icon"
        onClick={onIncrease}
        disabled={disabled || value >= max}
        className={cn(
          "size-7 rounded-full p-0",
          size === "large" && "size-12.5",
        )}
      >
        <Plus className={cn("size-3.5", size === "large" && "size-4")} />
        <span className="sr-only">Aumentar quantidade</span>
      </Button>
    </div>
  );
};

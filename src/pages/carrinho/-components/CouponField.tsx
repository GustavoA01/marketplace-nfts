import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type CouponFieldProps = {
  appliedCode: string | null;
  disabled: boolean;
  error?: string;
  onApply: (code: string) => void;
  onRemove: () => void;
};

export const CouponField = ({
  appliedCode,
  disabled,
  error,
  onApply,
  onRemove,
}: CouponFieldProps) => {
  const [code, setCode] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onApply(code.trim());
      }}
    >
      <Label htmlFor="cart-coupon" className="mb-2 text-sm font-bold">
        Código promocional
      </Label>
      <div className="flex overflow-hidden rounded-full border border-border-soft lg:rounded-sm">
        <Input
          id="cart-coupon"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          disabled={disabled}
          required
          maxLength={32}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "cart-coupon-error" : undefined}
          placeholder="Digite o código promocional..."
          className="h-12 rounded-none border-0 bg-transparent px-4 text-xs shadow-none placeholder:text-secondary md:text-xs lg:h-10 lg:px-2 dark:bg-transparent"
        />
        <Button
          type="submit"
          disabled={disabled || !code.trim()}
          className="h-12 rounded-full px-6 text-[15px] font-bold lg:h-10 lg:w-[102px] lg:rounded-none lg:px-3"
        >
          Aplicar
        </Button>
      </div>
      {error && (
        <p
          id="cart-coupon-error"
          role="alert"
          className="mt-2 text-sm text-error"
        >
          {error}
        </p>
      )}
      {appliedCode && (
        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <p role="status">
            Cupom aplicado: <strong>{appliedCode}</strong>
          </p>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={onRemove}
            className="h-auto px-2 py-1 text-text-accent"
          >
            Remover cupom
          </Button>
        </div>
      )}
    </form>
  );
};

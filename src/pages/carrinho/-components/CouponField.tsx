import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export const CouponField = ({ id = "cart-coupon" }: { id?: string }) => {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 text-sm font-bold">
        Código promocional
      </Label>
      <div className="flex overflow-hidden rounded-full border border-border-soft lg:rounded-sm">
        <Input
          id={id}
          placeholder="Digite o código promocional..."
          className="h-12 rounded-none border-0 bg-transparent px-4 text-xs shadow-none md:text-xs placeholder:text-secondary lg:h-10 lg:px-2 dark:bg-transparent"
        />
        <Button
          type="button"
          className="h-12 rounded-full px-6 text-[15px] font-bold lg:h-10 lg:w-[102px] lg:rounded-none lg:px-3"
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};

import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";

type CheckoutFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
};

export const CheckoutField = ({
  id,
  label,
  required = false,
  children,
}: CheckoutFieldProps) => {
  return (
    <div className="min-w-0">
      <Label
        htmlFor={id}
        className="flex min-h-[29px] items-center gap-1 text-[15px] leading-5 font-normal"
      >
        {label}
        {required && <span className="text-[22px] text-[#F0805F]">*</span>}
      </Label>
      {children}
    </div>
  );
};

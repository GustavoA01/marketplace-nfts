import type { ReactNode } from "react";
import { FieldError } from "@/components/FieldError";
import { FieldLabel } from "@/components/FieldLabel";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

export const FormField = ({
  label,
  htmlFor,
  required = false,
  error,
  className,
  children,
}: FormFieldProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <FieldLabel htmlFor={htmlFor} required={required}>
        {label}
      </FieldLabel>
      {children}
      <FieldError message={error} />
    </div>
  );
};

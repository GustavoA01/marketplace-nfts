import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
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
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const field = isValidElement(children)
    ? (children as ReactElement<{ id?: string; "aria-describedby"?: string }>)
    : undefined;
  const control =
    error && errorId && field?.props.id
      ? cloneElement(field, {
          "aria-describedby": [field.props["aria-describedby"], errorId]
            .filter(Boolean)
            .join(" "),
        })
      : children;

  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <FieldLabel htmlFor={htmlFor} required={required}>
        {label}
      </FieldLabel>
      {control}
      <FieldError id={errorId} message={error} />
    </div>
  );
};

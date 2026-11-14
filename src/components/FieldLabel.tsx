import { cn } from "@/lib/utils";

type FieldLabelProps = {
  htmlFor?: string;
  children: string;
  required?: boolean;
  className?: string;
};

export const FieldLabel = ({
  htmlFor,
  children,
  required = false,
  className,
}: FieldLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "flex items-center font-mono text-sm leading-4 text-foreground sm:text-[15px] sm:leading-[15px]",
        className,
      )}
    >
      {children}
      {required && (
        <span className="text-lg leading-5 text-[#f0805f] sm:text-[22px] sm:leading-[29px]">
          *
        </span>
      )}
    </label>
  );
};

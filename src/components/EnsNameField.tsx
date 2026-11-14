import type { ChangeEventHandler, Ref } from "react";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { FormField } from "@/components/FormField";

const ensSuffixItems = [
  { value: ".eth", label: ".eth" },
  { value: ".xyz", label: ".xyz" },
] as const;

type EnsNameFieldProps = {
  ensName: string;
  ensSuffix: ".eth" | ".xyz";
  ensNameError?: string;
  ensSuffixError?: string;
  disabled?: boolean;
  onEnsNameChange: ChangeEventHandler<HTMLInputElement>;
  onEnsSuffixChange: (value: ".eth" | ".xyz") => void;
  ensNameName?: string;
  ensNameRef?: Ref<HTMLInputElement>;
};

export const EnsNameField = ({
  ensName,
  ensSuffix,
  ensNameError,
  ensSuffixError,
  disabled = false,
  onEnsNameChange,
  onEnsSuffixChange,
  ensNameName,
  ensNameRef,
}: EnsNameFieldProps) => {
  return (
    <FormField
      label="Nome ENS"
      required
      error={ensNameError || ensSuffixError}
      className="gap-2.5"
    >
      <div className="flex w-full gap-2.5">
        <Select
          value={ensSuffix}
          onValueChange={(value) => {
            if (value === ".eth" || value === ".xyz") {
              onEnsSuffixChange(value);
            }
          }}
          items={[...ensSuffixItems]}
          disabled={disabled}
        >
          <SelectTrigger className="h-9 w-16 shrink-0 rounded-[3px] border-border bg-transparent px-2 font-mono text-xs text-foreground sm:h-10 sm:w-19.5 sm:px-2.5 sm:text-[15px] dark:bg-transparent dark:hover:bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ensSuffixItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          ref={ensNameRef}
          name={ensNameName}
          value={ensName}
          onChange={onEnsNameChange}
          disabled={disabled}
          aria-invalid={Boolean(ensNameError)}
          className="h-9 min-w-0 flex-1 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs placeholder:text-secondary sm:h-10 sm:px-4 sm:text-sm"
        />
      </div>
    </FormField>
  );
};

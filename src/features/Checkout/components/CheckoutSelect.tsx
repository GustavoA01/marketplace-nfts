import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type CheckoutSelectProps = {
  id: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
};

export const CheckoutSelect = ({
  id,
  placeholder,
  options,
  defaultValue,
}: CheckoutSelectProps) => {
  return (
    <Select items={options} defaultValue={defaultValue}>
      <SelectTrigger
        id={id}
        className="h-10 w-full data-[size=default]:h-10 rounded-sm border-border bg-transparent px-3 text-sm shadow-none dark:bg-transparent"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

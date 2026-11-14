import { Button } from "@/components/ui/Button";
import type { CatalogueOption } from "@/data/types/catalogue";
import { cn } from "@/lib/utils";

export type FilterOption = CatalogueOption;

type FilterOptionsProps = {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (name: string) => void;
};

export const FilterOptions = ({
  title,
  options,
  selected,
  onToggle,
}: FilterOptionsProps) => (
  <fieldset className="min-w-0">
    <legend className="mb-3 text-lg leading-4 font-bold">{title}</legend>
    <div className="px-3">
      {options.map(({ name, count }) => (
        <Button
          key={name}
          type="button"
          variant="ghost"
          aria-pressed={selected.includes(name)}
          onClick={() => onToggle(name)}
          className={cn(
            "flex h-10 w-full justify-between gap-2 rounded-none px-0 text-[15px] leading-10 font-normal hover:bg-transparent hover:text-text-accent",
            selected.includes(name)
              ? "font-bold text-text-accent underline underline-offset-4"
              : "text-text-secondary",
          )}
        >
          <span>{name}</span>
          <span className="font-bold">({count})</span>
        </Button>
      ))}
    </div>
  </fieldset>
);

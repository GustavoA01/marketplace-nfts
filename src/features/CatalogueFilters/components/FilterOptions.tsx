import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export type FilterOption = { name: string; count: number; selected?: boolean }

type FilterOptionsProps = {
  title: string
  options: FilterOption[]
}

export const FilterOptions = ({ title, options }: FilterOptionsProps) => {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-lg leading-4 font-bold">{title}</legend>
      <div className="px-3">
        {options.map(({ name, count, selected }) => (
          <Button key={name} type="button" variant="ghost" className={cn("flex h-10 w-full justify-between gap-2 rounded-none px-0 text-[15px] leading-10 font-normal hover:bg-transparent hover:text-text-accent", selected ? "text-text-accent" : "text-text-secondary")}>
            <span>{name}</span>
            <span className="font-bold">({count})</span>
          </Button>
        ))}
      </div>
    </fieldset>
  )
}

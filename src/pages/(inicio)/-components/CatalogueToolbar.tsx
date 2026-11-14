import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "all", label: "Todos os NFTs" },
  { value: "new", label: "Novos lançamentos" },
  { value: "trending", label: "Em alta" },
];

const sortOptions = [
  { value: "recent", label: "Listados recentemente" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

export const CatalogueToolbar = () => {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-x-4 xl:h-[18px]">
      <div className="-mx-1 flex gap-6 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab, index) => (
          <Button
            type="button"
            variant="ghost"
            key={tab.value}
            className={cn(
              "relative h-auto shrink-0 rounded-none px-1.5 pt-2 pb-2.5 text-[15px] leading-4 font-medium hover:bg-transparent",
              index === 0 && "text-text-accent",
            )}
          >
            {tab.label}
            {index === 0 && (
              <span className="absolute right-1 bottom-0 left-1 h-0.5 bg-primary" />
            )}
          </Button>
        ))}
      </div>
      <div className="hidden items-center gap-1 text-[15px] leading-4.5 md:flex">
        <span>Ordenar por:</span>
        <Select defaultValue={sortOptions[0].value} items={sortOptions}>
          <SelectTrigger className="h-auto max-w-53.75 gap-1 rounded-none border-0 bg-transparent p-0 text-[15px] shadow-none dark:bg-transparent dark:hover:bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { cn } from "@/lib/utils"

export const CatalogueToolbar = () => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-5 xl:h-[18px]">
      <div className="flex flex-wrap gap-5">
        {["Todos os NFTs", "Novos lançamentos", "Em alta"].map((title, index) => (
          <Button type="button" variant="ghost" key={title} className={cn("relative h-6 rounded-none px-0 pb-2 text-[15px] leading-4 font-medium hover:bg-transparent", index === 0 && "text-text-accent")}>
            {title}
            {index === 0 && <span className="absolute bottom-0 left-0 h-0.5 w-[101px] bg-primary" />}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[15px] leading-[18px]">
        <span>Ordenar por:</span>
        <Select defaultValue="recent" items={[
          { value: "recent", label: "Listados recentemente" },
          { value: "price-asc", label: "Menor preço" },
          { value: "price-desc", label: "Maior preço" },
        ]}>
          <SelectTrigger className="h-auto max-w-[215px] gap-1 rounded-none border-0 bg-transparent p-0 text-[15px] shadow-none dark:bg-transparent dark:hover:bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="recent">Listados recentemente</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

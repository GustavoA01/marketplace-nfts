import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const CataloguePagination = () => {
  return (
    <div className="flex justify-end gap-2">
      {[1, 2, 3, 4].map((page) => (
        <Button type="button" key={page} variant={page === 1 ? "default" : "outline"} className="size-8.75 rounded-sm p-0 text-lg leading-4">
          {page}
        </Button>
      ))}
      <Button type="button" variant="outline" className="size-8.75 rounded-sm p-0">
        <ChevronRight className="size-4.5" strokeWidth={1.6} />
      </Button>
    </div>
  )
}

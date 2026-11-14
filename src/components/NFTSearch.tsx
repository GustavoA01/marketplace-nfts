import { Search } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type NFTSearchProps = {
  value: string;
  onSearch: (value: string) => void;
};

export const NFTSearch = ({ value, onSearch }: NFTSearchProps) => {
  const id = useId();
  return (
    <form
      role="search"
      className="relative min-w-0 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSearch(String(data.get("q") ?? "").trim());
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute top-1 left-1 z-10 size-9 text-secondary"
      >
        <Search className="size-[22px]" />
        <span className="sr-only">Buscar NFTs</span>
      </Button>
      <Input
        key={value}
        id={id}
        name="q"
        type="search"
        defaultValue={value}
        maxLength={120}
        placeholder="Explorar coleções"
        className="h-[45px] rounded-[10px] border-0 bg-surface-card pr-3 pl-[42px] text-sm font-bold placeholder:text-secondary dark:bg-surface-card"
      />
      <label htmlFor={id} className="sr-only">
        Buscar NFTs, coleções ou criadores
      </label>
    </form>
  );
};

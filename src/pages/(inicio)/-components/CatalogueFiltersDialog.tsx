import type { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import type { FilterOption } from "./FilterOptions";
import { CatalogueFilters } from "./CatalogueFilters";

type CatalogueFiltersDialogProps = {
  trigger: ReactElement;
  collections: FilterOption[];
  networks: FilterOption[];
};

export const CatalogueFiltersDialog = ({
  trigger,
  collections,
  networks,
}: CatalogueFiltersDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent
        showCloseButton={false}
        className="max-h-[85svh] overflow-y-auto rounded-none"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <DialogTitle>Filtros do catálogo</DialogTitle>
          <DialogClose render={<Button variant="ghost">Fechar</Button>} />
        </div>
        <CatalogueFilters collections={collections} networks={networks} />
      </DialogContent>
    </Dialog>
  );
};

import type { ReactElement } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  CatalogueFilters,
  type CatalogueFiltersProps,
} from "./CatalogueFilters";

type CatalogueFiltersDialogProps = CatalogueFiltersProps & {
  trigger: ReactElement;
};

export const CatalogueFiltersDialog = ({
  trigger,
  ...props
}: CatalogueFiltersDialogProps) => (
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
      <CatalogueFilters {...props} />
    </DialogContent>
  </Dialog>
);

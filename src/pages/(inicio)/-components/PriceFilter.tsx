import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";

type PriceFilterProps = {
  minPrice?: number;
  maxPrice?: number;
  onApply: (range: number[]) => void;
};

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onApply,
}: PriceFilterProps) => {
  const id = useId();
  const [range, setRange] = useState([minPrice ?? 0, maxPrice ?? 18]);
  return (
    <fieldset>
      <legend id={id} className="mb-3 text-lg leading-4 font-bold">
        Faixa de preço
      </legend>
      <div className="flex flex-col items-start gap-3 pl-3">
        <Slider
          min={0}
          max={Math.max(18, maxPrice ?? 18)}
          step={0.01}
          value={range}
          aria-labelledby={id}
          onValueChange={(value) =>
            setRange(Array.isArray(value) ? value : [0, value])
          }
          className="h-3.75"
        />
        <p className="text-[15px] leading-5">
          Preço: {range[0].toLocaleString("pt-BR")} -{" "}
          {range[1].toLocaleString("pt-BR")} ETH
        </p>
        <Button
          type="button"
          onClick={() => onApply(range)}
          className="h-9 rounded-md px-3 text-base leading-5 font-bold"
        >
          Aplicar
        </Button>
      </div>
    </fieldset>
  );
};

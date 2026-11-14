import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";

export const PriceFilter = () => {
  return (
    <fieldset>
      <legend className="mb-3 text-lg leading-4 font-bold">
        Faixa de preço
      </legend>
      <div className="flex flex-col items-start gap-3 pl-3">
        <Slider
          min={0.02}
          max={18}
          step={0.01}
          value={[0.02, 12.3]}
          className="h-3.75"
        />
        <p className="text-[15px] leading-5">Preço: 0,02 - 12,30 ETH</p>
        <Button
          type="button"
          className="h-9 rounded-md px-3 text-base leading-5 font-bold"
        >
          Aplicar
        </Button>
      </div>
    </fieldset>
  );
};

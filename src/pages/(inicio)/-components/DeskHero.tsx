import { Button } from "@/components/ui/Button";

export const DeskHero = () => {
  return (
    <section className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10 xl:gap-[110px] xl:pl-10">
      <div className="min-w-0 flex-1 xl:w-[600px] xl:flex-none">
        <p className="text-sm leading-4 font-medium tracking-[1.4px]">
          Bem-vindo à Kurio
        </p>

        <h1 className="mt-2 text-3xl leading-normal font-bold uppercase xl:text-[43px] xl:leading-[70px]">
          Seja dono do futuro
          <br />
          da arte digital
        </h1>

        <p className="mt-1 max-w-[557px] text-sm leading-6 text-text-secondary">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>

        <Button
          type="button"
          className="mt-8 h-10 w-35 rounded-md px-0 text-base leading-5 font-bold uppercase"
        >
          Explorar
        </Button>

        <div className="mt-11 flex justify-end">
          <img src="/icons/HeroIndicators.svg" alt="" />
        </div>
      </div>

      <img
        src="/mocks/HeroMonkey.png"
        alt="Macaco com óculos de sol e jaqueta verde"
        width={450}
        height={450}
        fetchPriority="high"
        className="aspect-square w-full rounded-3xl object-cover md:w-80 md:shrink-0 xl:w-[450px]"
      />
    </section>
  );
};

import { Button } from "@/components/ui/button"

export const Hero = () => {
  return (
    <section className="flex flex-col gap-8 font-mono md:flex-row md:items-center lg:gap-16">
      <div className="min-w-0 flex-1">
        <p className="text-base tracking-wider">Bem-vindo à Kurio</p>

        <h1 className="mt-4 text-3xl leading-normal font-bold uppercase lg:text-[43px]">
          Seja dono do futuro
          <br />
          da arte digital
        </h1>

        <p className="mt-2 text-base leading-relaxed text-secondary">
          Descubra NFTs selecionados de criadores emergentes e consagrados.
          Colecione arte digital rara, apoie artistas e tenha uma parte da
          cultura da internet.
        </p>

        <Button type="button" className="mt-7 h-10 rounded-sm px-6 font-mono font-bold uppercase">
          Explorar
        </Button>

        <div className="mt-10 flex justify-end gap-2">
          <span className="size-2 rounded-full bg-primary" />
          <span className="size-2 rounded-full bg-primary/50" />
          <span className="size-2 rounded-full bg-primary/50" />
        </div>
      </div>

      <img
        src="/mocks/GlassesMonkey.png"
        alt="Macaco com óculos de sol e jaqueta verde"
        width={384}
        height={384}
        fetchPriority="high"
        className="aspect-square w-full rounded-3xl object-cover md:w-80 md:shrink-0 lg:w-96"
      />
    </section>
  )
}

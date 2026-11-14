import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { homePromosMock } from "@/mocks/temporary/home-content";

export const HomePromos = () => {
  return (
    <section className="flex flex-col gap-7 lg:flex-row">
      {homePromosMock.map((promo) => (
        <Card
          key={promo.id}
          className="relative flex h-[250px] min-w-0 flex-1 flex-row gap-0 overflow-hidden rounded-lg p-0 ring-0"
        >
          <img
            src={promo.image}
            alt={promo.title}
            width={292}
            height={250}
            loading="lazy"
            className="h-[250px] w-1/2 shrink-0 rounded-[18px] object-cover"
          />
          <div className="relative z-10 flex min-w-0 flex-1 flex-col items-end justify-center gap-2 px-4 py-5 text-right xl:pr-[30px]">
            <h2 className="text-sm leading-6 font-bold sm:text-lg">
              {promo.title}
            </h2>
            <p className="text-xs leading-5 text-text-secondary xl:text-sm xl:leading-6">
              {promo.description}
            </p>
            <Button
              nativeButton={false}
              render={<Link to="/" hash="catalogo" />}
              className="mt-2 h-10 rounded-md px-5 text-sm font-medium"
            >
              Explorar
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[url('/mocks/PromoDecoration.svg')] bg-cover" />
        </Card>
      ))}
    </section>
  );
};

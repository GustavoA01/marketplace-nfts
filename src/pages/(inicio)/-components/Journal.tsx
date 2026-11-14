import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { journalMock } from "@/data/mocks/temporary/home-content";

export const Journal = () => {
  return (
    <section className="mt-24 mb-[72px]">
      <h2 className="text-center text-[28px] leading-9 font-bold">
        Diário da Cunhagem
      </h2>
      <p className="mt-3 text-center text-sm leading-[18px] text-text-secondary">
        Histórias, guias e insights para colecionadores sobre o universo da
        propriedade digital.
      </p>
      <div className="mt-10 grid max-w-[1144px] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {journalMock.map((article) => (
          <Card
            key={article.id}
            className="gap-0 overflow-hidden rounded-lg p-0 ring-0"
          >
            <img
              src={article.image}
              alt={article.title}
              width={268}
              height={195}
              loading="lazy"
              className="h-[195px] w-full object-cover"
            />
            <div className="space-y-2 px-4 pt-3 pb-4">
              <p className="min-h-8 text-xs leading-4 font-medium text-text-secondary">
                {article.date} | Leitura de {article.minutes} min
              </p>
              <h3 className="min-h-[42px] text-base leading-[21px] font-bold">
                {article.title}
              </h3>
              <p className="min-h-8 text-xs leading-4 font-medium text-text-secondary">
                {article.description}
              </p>
              <Button
                type="button"
                variant="link"
                className="h-4 gap-1 p-0 text-xs leading-[14px] font-bold text-text-accent"
              >
                Ler mais
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

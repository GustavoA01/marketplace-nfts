import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";

type NotFoundPageProps = {
  title?: string;
  description?: string;
};

export const NotFoundPage = ({
  title = "Página não encontrada",
  description = "O endereço que você abriu não existe ou foi removido.",
}: NotFoundPageProps) => (
  <section
    role="alert"
    className="mx-auto flex min-h-[50svh] max-w-xl flex-col items-start justify-center gap-6 px-1 py-16 font-mono"
  >
    <p className="text-sm font-bold tracking-wide text-text-accent">404</p>
    <div className="space-y-3">
      <h1 className="text-2xl leading-tight font-bold sm:text-3xl">{title}</h1>
      <p className="text-sm leading-6 text-text-secondary sm:text-base">
        {description}
      </p>
    </div>
    <div className="flex flex-wrap gap-3">
      <Button
        nativeButton={false}
        render={<Link to="/" />}
        className="h-11 rounded-lg px-5 font-bold"
      >
        Voltar ao início
      </Button>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link to="/" hash="catalogo" />}
        className="h-11 rounded-lg px-5 font-bold"
      >
        Ver catálogo
      </Button>
    </div>
  </section>
);

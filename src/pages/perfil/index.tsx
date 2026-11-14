import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

const Page = () => {
  return <PagePlaceholder title="Perfil do colecionador" />;
};

export const Route = createFileRoute("/perfil/")({
  component: Page,
});

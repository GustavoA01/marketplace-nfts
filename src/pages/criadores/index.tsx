import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

const Page = () => {
  return <PagePlaceholder title="Criadores" />;
};

export const Route = createFileRoute("/criadores/")({
  component: Page,
});

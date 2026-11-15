import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

const Page = () => <PagePlaceholder title="Mercado" />;

export const Route = createFileRoute("/mercado/")({
  component: Page,
});

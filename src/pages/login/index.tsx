import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/PagePlaceholder";

const Page = () => {
  return <PagePlaceholder title="Login" />;
};

export const Route = createFileRoute("/login/")({
  component: Page,
});

import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/Auth/container/AuthPage";

const Page = () => <AuthPage initialMode="signup" />;

export const Route = createFileRoute("/cadastro/")({
  component: Page,
});

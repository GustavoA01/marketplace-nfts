import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/Auth/container/AuthPage";

export const Route = createFileRoute("/login/")({
  component: AuthPage,
});

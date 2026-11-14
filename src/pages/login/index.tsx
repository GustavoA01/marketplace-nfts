import { safeReturnTo } from "@/features/Auth/utils/navigation";
import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/features/Auth/container/AuthPage";

export const Route = createFileRoute("/login/")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: safeReturnTo(search.redirect),
  }),
  component: AuthPage,
});

import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/features/Checkout/container/Checkout";

export const Route = createFileRoute("/pagamento/")({
  beforeLoad: requireSession,
  component: Checkout,
});

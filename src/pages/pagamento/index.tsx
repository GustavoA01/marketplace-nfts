import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/features/Checkout/container/Checkout";

export const Route = createFileRoute("/pagamento/")({
  component: Checkout,
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";
import "./index.css";

const enableMocking = async () => {
  if (import.meta.env.VITE_ENABLE_MOCKS !== "true") return;
  const { configureRealtimeScenario } =
    await import("./data/mocks/realtime/config");
  configureRealtimeScenario();

  const { worker } = await import("./data/mocks/browser");
  return worker.start();
};

enableMocking().then(async () => {
  const { router } = await import("./router");

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
});

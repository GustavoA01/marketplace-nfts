import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const RootLayout = () => {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <main className="container mx-auto mt-8 flex-1 px-5 pb-6 sm:px-8 xl:max-w-316">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <h1>Página não encontrada</h1>,
});

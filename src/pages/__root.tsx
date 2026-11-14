import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

const RootLayout = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isHome = pathname === "/";
  const isAccount = /^\/(perfil|carteiras)(\/|$)/.test(pathname);
  const isPurchase =
    /^\/(nfts|carrinho|pagamento|confirmacao-pedido)(\/|$)/.test(pathname);
  const hideHeaderOnMobile = isHome || isPurchase || isAccount;
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <div className={hideHeaderOnMobile ? "hidden lg:block" : undefined}>
        <Header />
      </div>
      <main
        className={cn(
          "container mx-auto flex-1 pb-6 sm:px-8 xl:max-w-316",
          isPurchase
            ? "mt-0 px-0 sm:px-0 lg:mt-8 lg:px-8"
            : isHome
              ? "mt-10 px-6 pb-32 lg:mt-8 lg:px-8 lg:pb-6"
              : isAccount
                ? "mt-4 px-4 pb-32 sm:px-8 lg:mt-8 lg:pb-6"
                : "mt-8 px-5",
        )}
      >
        <Outlet />
      </main>
      {isHome && <Footer />}
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <h1>Página não encontrada</h1>,
});

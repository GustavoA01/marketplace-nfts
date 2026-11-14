import { queryKeys } from "@/data/query-keys";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/features/Auth/hooks/useSession";
import { clearUserCache } from "@/features/Auth/utils/session";
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/Sonner";
import { cn } from "@/lib/utils";

const RootLayout = () => {
  const location = useRouterState({ select: (state) => state.location });
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { data: user } = useSession();
  const isLoggingOut =
    useIsMutating({ mutationKey: queryKeys.auth.logout }) > 0;
  const previousUserId = useRef<string | undefined>(undefined);
  const isPrivate =
    /^\/(perfil|carteiras|pagamento|confirmacao-pedido)(\/|$)/.test(pathname);

  useEffect(() => {
    if (user === undefined) return;
    const hadUser = previousUserId.current !== undefined;
    previousUserId.current = user?.id;
    if (!user && hadUser && !isLoggingOut) void clearUserCache(true);
    if (user === null && isPrivate && !isLoggingOut) {
      void navigate({
        to: "/login",
        search: { redirect: location.href },
        replace: true,
      });
    }
  }, [user, isPrivate, isLoggingOut, location.href, navigate]);
  const isHome = pathname === "/";
  const isAccount = /^\/(perfil|carteiras)(\/|$)/.test(pathname);
  const isAuth = /^\/(login|cadastro)(\/|$)/.test(pathname);
  const isPurchase =
    /^\/(nfts|carrinho|pagamento|confirmacao-pedido)(\/|$)/.test(pathname);
  const hideHeaderOnMobile = isHome || isPurchase || isAccount || isAuth;

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
                : isAuth
                  ? "mt-0 px-0 pb-6 lg:mt-8 lg:px-5"
                  : "mt-8 px-5",
        )}
      >
        <Outlet />
      </main>
      {isHome && <Footer />}
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <h1>Página não encontrada</h1>,
});

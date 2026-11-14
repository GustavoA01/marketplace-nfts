import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, ScanLine, ShoppingCart, UserRound } from "lucide-react";
import { useSession } from "@/features/Auth/hooks/useSession";
import { cn } from "@/lib/utils";

export const MobileBottomNavigation = () => {
  const { data: user } = useSession();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const items = [
    {
      to: "/",
      label: "Início",
      Icon: Home,
      match: (path: string) => path === "/",
    },
    {
      to: "/perfil",
      label: "Favoritos",
      Icon: Heart,
      match: () => false,
    },
    {
      to: "/",
      label: "Explorar catálogo",
      Icon: ScanLine,
      hash: "catalogo",
      match: () => false,
      featured: true,
    },
    {
      to: "/carrinho",
      label: "Carrinho",
      Icon: ShoppingCart,
      match: (path: string) => path.startsWith("/carrinho"),
    },
    {
      to: user ? "/perfil" : "/login",
      label: "Meu perfil",
      Icon: UserRound,
      match: (path: string) =>
        path.startsWith("/perfil") ||
        path.startsWith("/carteiras") ||
        path.startsWith("/login") ||
        path.startsWith("/cadastro"),
    },
  ] as const;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-[95px] items-center justify-around rounded-t-[30px] bg-surface-card px-4 pb-5 lg:hidden">
      {items.map(({ to, label, Icon, match, ...rest }) => {
        const featured = "featured" in rest && rest.featured;
        const hash = "hash" in rest ? rest.hash : undefined;
        const isActive = match(pathname);

        return (
          <Link
            key={label}
            to={to}
            hash={hash}
            className={cn(
              "flex size-11 items-center justify-center rounded-full text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive && "text-text-accent",
              featured &&
                "-translate-y-7 size-[72px] border-8 border-background bg-linear-to-br from-primary/45 to-primary text-foreground",
            )}
          >
            <Icon className={cn("size-5", featured && "size-6")} />
            <span className="sr-only">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

import { Link, useRouterState } from "@tanstack/react-router";
import { useSession } from "@/features/Auth/hooks/useSession";

const icons = {
  home: {
    idle: "/icons/tab-bar/home.svg",
    active: "/icons/tab-bar/home-active.svg",
  },
  heart: {
    idle: "/icons/tab-bar/heart.svg",
    active: "/icons/tab-bar/heart-active.svg",
  },
  cart: {
    idle: "/icons/tab-bar/cart.svg",
    active: "/icons/tab-bar/cart-active.svg",
  },
  user: {
    idle: "/icons/tab-bar/user.svg",
    active: "/icons/tab-bar/user-active.svg",
  },
} as const;

type NavIcon = (typeof icons)[keyof typeof icons];

type SideItem = {
  to: string;
  label: string;
  icon: NavIcon;
  match: (path: string) => boolean;
};

export const MobileBottomNavigation = () => {
  const { data: user } = useSession();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const leftItems: SideItem[] = [
    {
      to: "/",
      label: "Início",
      icon: icons.home,
      match: (path) => path === "/",
    },
    {
      to: "/favoritos",
      label: "Favoritos",
      icon: icons.heart,
      match: (path) => path.startsWith("/favoritos"),
    },
  ];

  const rightItems: SideItem[] = [
    {
      to: "/carrinho",
      label: "Carrinho",
      icon: icons.cart,
      match: (path) => path.startsWith("/carrinho"),
    },
    {
      to: user ? "/perfil" : "/login",
      label: "Meu perfil",
      icon: icons.user,
      match: (path) =>
        path.startsWith("/perfil") ||
        path.startsWith("/carteiras") ||
        path.startsWith("/login") ||
        path.startsWith("/cadastro"),
    },
  ];

  const renderSideItem = ({ to, label, icon, match }: SideItem) => {
    const isActive = match(pathname);

    return (
      <Link
        key={label}
        to={to}
        className="flex size-5 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={isActive ? icon.active : icon.idle}
          alt=""
          width={20}
          height={20}
          className="size-5"
        />
        <span className="sr-only">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-31.5 lg:hidden">
      <svg
        viewBox="30 40 414 95"
        aria-hidden="true"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-23.75 w-full drop-shadow-[0_-10px_30px_rgba(10,6,4,0.45)]"
      >
        <path
          d="M312.85 40C299.09 40 286.87 48.2 281.02 60.65C273.26 77.17 256.46 88.62 237 88.62C217.54 88.62 200.74 77.18 192.98 60.65C187.13 48.2 174.9 40 161.15 40H58.93C42.95 40 30 52.95 30 68.93V135H444V68.93C444 52.95 431.05 40 415.07 40H312.85Z"
          className="fill-surface-card"
        />
      </svg>

      <div className="relative mx-auto h-full w-full max-w-103.5">
        <Link
          to="/"
          hash="catalogo"
          activeOptions={{ exact: true, includeHash: true }}
          className="pointer-events-auto absolute top-0 left-1/2 flex size-16.25 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-b from-primary/40 to-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img src="/icons/tab-bar/scan.svg" alt="" width={27} height={24} />
          <span className="sr-only">Explorar catálogo</span>
        </Link>

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex h-23.75 items-start justify-between pr-10 pl-9 pt-10">
          <div className="flex gap-13">{leftItems.map(renderSideItem)}</div>
          <div className="size-16.25 shrink-0" />
          <div className="flex gap-10.5">{rightItems.map(renderSideItem)}</div>
        </div>
      </div>
    </nav>
  );
};

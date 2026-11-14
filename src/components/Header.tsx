import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogIn, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { NFTSearch } from "@/components/NFTSearch";
import { normalizeCatalogueSearch } from "@/data/schemas/catalogue";
import { navigation } from "@/data/constants/navigation";
import { AuthDialog } from "@/features/Auth/container/AuthDialog";
import { useSession } from "@/features/Auth/hooks/useSession";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const currentSearch = useRouterState({
    select: (state) => state.location.search,
  });
  const { data: user, isPending } = useSession();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isPurchase =
    /^\/(nfts|carrinho|pagamento|confirmacao-pedido)(\/|$)/.test(pathname);

  return (
    <header className="pt-6 text-foreground">
      <div className="container mx-auto px-5 sm:px-8 xl:max-w-316">
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-x-6 gap-y-3 border-b md:h-11.25 md:flex-nowrap",
            isPurchase ? "border-transparent" : "border-border",
          )}
        >
          <Link
            to="/"
            className="flex h-9 w-fit shrink-0 items-center rounded-sm text-sm leading-5 font-bold tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-ring xl:w-40"
          >
            KURIO
          </Link>
          <nav className="flex h-11.25 shrink-0 gap-4 lg:gap-10">
            {navigation.map(({ label, to }) => (
              <Link
                key={to}
                data-section-active={
                  to === "/mercado" && isPurchase ? "true" : undefined
                }
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="inline-flex h-11.25 items-start border-b-3 border-transparent text-base leading-5.25 whitespace-nowrap transition-colors outline-none hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring data-[status=active]:border-primary data-[status=active]:font-bold data-[status=active]:text-text-accent data-[section-active=true]:border-primary data-[section-active=true]:font-bold data-[section-active=true]:text-text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex h-8.75 shrink-0 items-center gap-4 lg:gap-7">
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-5 rounded-sm border-0"
                  />
                }
              >
                <Search className="size-5" strokeWidth={1.6} />
                <span className="sr-only">Buscar NFTs</span>
              </DialogTrigger>
              <DialogContent className="gap-5 p-6">
                <DialogTitle>Buscar NFTs</DialogTitle>
                <NFTSearch
                  value={
                    typeof currentSearch.q === "string" ? currentSearch.q : ""
                  }
                  onSearch={(q) => {
                    void navigate({
                      to: "/",
                      hash: "catalogo",
                      search: (previous) =>
                        normalizeCatalogueSearch({ ...previous, q, page: 1 }),
                    });
                    setSearchOpen(false);
                  }}
                />
                <p className="text-sm text-text-secondary">
                  Busque por nome, coleção ou criador e pressione Enter.
                </p>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-6 w-7.75 justify-start rounded-sm"
              nativeButton={false}
              render={<Link to="/carrinho" />}
            >
              <ShoppingCart className="size-6" strokeWidth={1.6} />
              <span className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] leading-none font-medium text-ink ring-2 ring-background">
                0
              </span>
            </Button>

            {isPending ? (
              <div className="size-8.75 shrink-0" />
            ) : user ? (
              <Button
                variant="default"
                size="icon"
                className="size-8.75 overflow-hidden rounded-full p-0 text-base font-bold"
                nativeButton={false}
                render={<Link to="/perfil" />}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <span aria-hidden>
                    {(user.displayName || user.username)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
                <span className="sr-only">
                  {user.displayName || user.username}
                </span>
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      type="button"
                      className="h-8.75 w-25 gap-1 rounded-md px-0 text-base leading-5 font-medium"
                    />
                  }
                >
                  <LogIn className="size-5" strokeWidth={1.6} />
                  Entrar
                </DialogTrigger>
                <AuthDialog />
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

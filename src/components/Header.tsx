import { Link } from "@tanstack/react-router"
import { LogIn, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { label: "Início", to: "/" },
  { label: "Mercado", to: "/mercado" },
  { label: "Criadores", to: "/criadores" },
  { label: "Aprenda", to: "/aprenda" },
] as const

export const Header = () => {
  return (
    <header className="mt-6 bg-background text-foreground">
      <div className="container mx-auto px-5 sm:px-8">
        <div className="flex min-h-11.25 flex-wrap items-center justify-between gap-x-6 border-b border-border">
          <Link
            to="/"
            className="w-fit rounded-sm font-mono text-sm font-bold tracking-[0.14em] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            KURIO
          </Link>

          <nav className="flex h-11.25 gap-4 sm:gap-8">
            {navigation.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="inline-flex h-11.25 items-center border-b-2 border-transparent font-mono text-md  text-foreground transition-colors outline-none hover:text-primary-light focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[status=active]:border-primary data-[status=active]:font-semibold data-[status=active]:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex h-11.25 items-center gap-2 sm:gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-sm hover:bg-surface-raised"
            >
              <Search className="size-5" strokeWidth={1.6} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-sm hover:bg-surface-raised"
              render={<Link to="/carrinho" />}
            >
              <ShoppingCart className="size-5" strokeWidth={1.6} />
              <span className="absolute top-0.5 right-0 flex size-3.5 items-center justify-center rounded-full bg-primary font-mono text-[9px] font-semibold text-primary-foreground">
                0
              </span>
            </Button>

            <Button
              type="button"
              className="h-8 gap-1.5 rounded-sm px-2.5 font-mono text-md tracking-[0.02em]"
            >
              <LogIn className="size-4" strokeWidth={1.6} />
              Entrar
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

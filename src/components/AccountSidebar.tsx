import { Link } from "@tanstack/react-router";
import {
  Activity,
  Download,
  Heart,
  LogOut,
  MapPin,
  ShoppingBag,
  TriangleAlert,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  {
    label: "Dados do perfil",
    to: "/perfil",
    icon: User,
    key: "profile" as const,
  },
  {
    label: "Carteiras",
    to: "/carteiras",
    icon: MapPin,
    key: "wallets" as const,
  },
] as const;

const secondaryLinks = [
  {
    label: "Atividade",
    icon: ShoppingBag,
  },
  {
    label: "Lista de interesse",
    icon: Heart,
  },
  {
    label: "Ofertas",
    icon: Activity,
  },
  {
    label: "Arquivos baixados",
    icon: Download,
  },
  {
    label: "Suporte",
    icon: TriangleAlert,
  },
] as const;

type AccountSidebarProps = {
  active: "profile" | "wallets";
};

export const AccountSidebar = ({ active }: AccountSidebarProps) => {
  return (
    <aside className="w-full shrink-0 bg-surface-card py-2 font-mono sm:w-77.5">
      <div className="px-2.5 py-2">
        <p className="text-base font-bold leading-4 text-foreground sm:text-lg">
          Meu perfil
        </p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 pb-1 sm:flex-col sm:gap-0 sm:overflow-visible sm:px-0 sm:pb-0">
        {primaryLinks.map(({ label, to, icon: Icon, key }) => {
          const isActive = active === key;

          return (
            <Link
              key={label}
              to={to}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm leading-none text-text-accent outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring sm:gap-3 sm:rounded-none sm:border-l-6 sm:border-transparent sm:px-4 sm:py-0 sm:text-[15px] sm:leading-11.25 sm:focus-visible:ring-inset",
                isActive &&
                  "bg-surface-raised text-text-accent sm:border-primary sm:bg-transparent",
              )}
            >
              <Icon className="size-4 shrink-0 sm:size-4.5" strokeWidth={1.6} />
              {label}
            </Link>
          );
        })}
      </nav>

      <nav className="mt-1 hidden flex-col sm:flex">
        {secondaryLinks.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex items-center gap-3 px-4 text-[15px] leading-11.25 text-text-accent/60"
          >
            <Icon className="size-4.5 shrink-0" strokeWidth={1.6} />
            {label}
          </span>
        ))}
      </nav>

      <div className="mt-1 border-t border-border sm:mt-0">
        <button
          type="button"
          onClick={() => {
            console.log("Logout fora do escopo desta etapa");
          }}
          className="flex h-9 w-full items-center gap-2 px-4 text-sm font-bold leading-[15px] text-text-accent outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:h-10 sm:text-[15px]"
        >
          <LogOut className="size-4.5 sm:size-5" strokeWidth={1.6} />
          Sair
        </button>
      </div>
    </aside>
  );
};

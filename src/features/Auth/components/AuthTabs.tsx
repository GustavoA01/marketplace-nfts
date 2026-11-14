import { cn } from "cn";

export type AuthMode = "login" | "signup";

type AuthTabsProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};

export const AuthTabs = ({ mode, onModeChange }: AuthTabsProps) => {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-xl leading-4">
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className={cn(
          "rounded-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          mode === "login" ? "text-text-accent" : "text-foreground",
        )}
      >
        Entrar
      </button>
      <span aria-hidden className="h-5 w-px bg-primary" />
      <button
        type="button"
        onClick={() => onModeChange("signup")}
        className={cn(
          "rounded-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          mode === "signup" ? "text-text-accent" : "text-foreground",
        )}
      >
        Criar conta
      </button>
    </div>
  );
};

import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AuthTabs, type AuthMode } from "@/features/Auth/components/AuthTabs";
import { SocialAuthButtons } from "@/features/Auth/components/SocialAuthButtons";
import { LoginForm } from "@/features/Auth/container/LoginForm";
import { SignUpForm } from "@/features/Auth/container/SignUpForm";
import { safeReturnTo } from "@/features/Auth/utils/navigation";

type AuthPageProps = {
  initialMode?: AuthMode;
};

const desktopAuthQuery = "(min-width: 1024px)";

const subscribeDesktopAuth = (onStoreChange: () => void) => {
  const media = window.matchMedia(desktopAuthQuery);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
};

const useIsDesktopAuth = () =>
  useSyncExternalStore(
    subscribeDesktopAuth,
    () => window.matchMedia(desktopAuthQuery).matches,
    () => false,
  );

export const AuthPage = ({ initialMode = "login" }: AuthPageProps) => {
  const isDesktop = useIsDesktopAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const redirect = useRouterState({
    select: (state) =>
      safeReturnTo((state.location.search as Record<string, unknown>).redirect),
  });
  const activeMode = isDesktop ? mode : initialMode;
  const isLogin = activeMode === "login";
  const switchSearch = redirect ? { redirect } : undefined;

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isDesktop) {
    return (
      <div className="flex flex-col gap-10 px-7 pt-20 pb-6 font-mono text-foreground">
        <div className="flex h-[136px] items-center justify-center">
          <Link
            to="/"
            className="text-[32px] leading-none font-bold tracking-[3.2px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            KURIO
          </Link>
        </div>

        <h1
          className={
            isLogin
              ? "text-center text-xl leading-4 font-bold"
              : "text-center text-lg leading-4 font-bold"
          }
        >
          {isLogin ? "Entrar" : "Criar perfil de colecionador"}
        </h1>

        {isLogin ? <LoginForm /> : <SignUpForm />}

        <SocialAuthButtons padded={false} />

        <p className="text-center text-[15px] text-text-secondary">
          {isLogin ? (
            <>
              Novo na Kurio?{" "}
              <Link
                to="/cadastro"
                search={switchSearch}
                className="outline-none transition-colors hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                Crie uma conta
              </Link>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <Link
                to="/login"
                search={switchSearch}
                className="outline-none transition-colors hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                Entre
              </Link>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 sm:py-12">
      <section className="relative w-full max-w-125 overflow-hidden rounded-lg bg-surface-card pb-10 font-mono text-foreground shadow-lg">
        <span
          aria-hidden
          className="absolute right-0 bottom-0 left-0 h-2.5 bg-primary"
        />

        <div className="flex flex-col gap-10 px-6 pt-12 sm:px-12">
          <AuthTabs mode={mode} onModeChange={setMode} />
          <p className="text-center text-[13px] leading-4 text-foreground">
            {isLogin
              ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
              : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
          </p>
        </div>

        <div className="flex flex-col pt-6">
          <div className="px-6 sm:px-20">
            {isLogin ? <LoginForm /> : <SignUpForm />}
          </div>
          <div className="pt-6">
            <SocialAuthButtons />
          </div>
        </div>
      </section>
    </div>
  );
};

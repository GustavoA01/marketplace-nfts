import type { ReactNode } from "react";
import { AuthTabs } from "@/features/Auth/components/AuthTabs";
import { SocialAuthButtons } from "@/features/Auth/components/SocialAuthButtons";
import type { AuthMode } from "@/features/Auth/components/AuthTabs";

type AuthPanelProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  children: ReactNode;
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
};

export const AuthPanel = ({
  mode,
  onModeChange,
  children,
  onGoogleClick,
  onFacebookClick,
}: AuthPanelProps) => {
  const isLogin = mode === "login";

  return (
    <section className="relative w-full max-w-125 overflow-hidden rounded-lg bg-surface-card pb-10 font-mono text-foreground shadow-lg">
      <span
        aria-hidden
        className="absolute right-0 bottom-0 left-0 h-2.5 bg-primary"
      />

      <div className="flex flex-col gap-10 px-6 pt-12 sm:px-12">
        <AuthTabs mode={mode} onModeChange={onModeChange} />
        <p className="text-center text-[13px] leading-4 text-foreground">
          {isLogin
            ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
            : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
        </p>
      </div>

      <div className="flex flex-col pt-6">
        <div className="px-6 sm:px-20">{children}</div>
        <div className="pt-6">
          <SocialAuthButtons
            onGoogleClick={onGoogleClick}
            onFacebookClick={onFacebookClick}
          />
        </div>
      </div>
    </section>
  );
};

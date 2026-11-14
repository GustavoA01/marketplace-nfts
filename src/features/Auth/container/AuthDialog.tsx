import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { AuthTabs, type AuthMode } from "@/features/Auth/components/AuthTabs";
import { SocialAuthButtons } from "@/features/Auth/components/SocialAuthButtons";
import { LoginForm } from "@/features/Auth/container/LoginForm";
import { SignUpForm } from "@/features/Auth/container/SignUpForm";

export const AuthDialog = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const isLogin = mode === "login";

  return (
    <DialogContent className="max-w-125 gap-0 pb-10 font-mono sm:max-w-125">
      <span
        aria-hidden
        className="absolute right-0 bottom-0 left-0 h-2.5 bg-primary"
      />

      <DialogHeader className="gap-10 px-6 pt-12 sm:px-12">
        <DialogTitle className="sr-only">
          {isLogin ? "Entrar" : "Criar conta"}
        </DialogTitle>
        <AuthTabs mode={mode} onModeChange={setMode} />
        <DialogDescription className="text-center text-[13px] leading-4 text-foreground">
          {isLogin
            ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
            : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col pt-6">
        <div className="px-6 sm:px-20">
          {isLogin ? <LoginForm /> : <SignUpForm />}
        </div>
        <div className="pt-6">
          <SocialAuthButtons />
        </div>
      </div>
    </DialogContent>
  );
};

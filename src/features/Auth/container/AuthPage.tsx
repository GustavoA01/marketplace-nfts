import { useState } from "react";
import { AuthPanel } from "@/features/Auth/components/AuthPanel";
import type { AuthMode } from "@/features/Auth/components/AuthTabs";
import { LoginForm } from "@/features/Auth/container/LoginForm";
import { SignUpForm } from "@/features/Auth/container/SignUpForm";

type AuthPageContainerProps = {
  initialMode?: AuthMode;
};

export const AuthPage = ({ initialMode = "login" }: AuthPageContainerProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <div className="flex justify-center py-8 sm:py-12">
      <AuthPanel
        mode={mode}
        onModeChange={setMode}
        onGoogleClick={() => {
          console.log("Login social Google fora do escopo desta etapa");
        }}
        onFacebookClick={() => {
          console.log("Login social Facebook fora do escopo desta etapa");
        }}
      >
        {mode === "login" ? <LoginForm /> : <SignUpForm />}
      </AuthPanel>
    </div>
  );
};

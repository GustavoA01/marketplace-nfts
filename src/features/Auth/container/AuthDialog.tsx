import { useState } from "react";
import { AuthDialog as AuthDialogView } from "@/features/Auth/components/AuthDialog";
import type { AuthMode } from "@/features/Auth/components/AuthTabs";
import { LoginForm } from "@/features/Auth/container/LoginForm";
import { SignUpForm } from "@/features/Auth/container/SignUpForm";

export const AuthDialog = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <AuthDialogView
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
    </AuthDialogView>
  );
};

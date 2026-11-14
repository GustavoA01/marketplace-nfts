import { useState } from "react";
import { AuthDialog as AuthDialogView } from "../components/AuthDialog";
import type { AuthMode } from "../components/AuthTabs";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export const AuthDialog = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <AuthDialogView mode={mode} onModeChange={setMode}>
      {mode === "login" ? <LoginForm /> : <SignUpForm />}
    </AuthDialogView>
  );
};

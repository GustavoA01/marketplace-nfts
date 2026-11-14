import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormStatusMessage } from "@/components/FormStatusMessage";
import type { LoginFormValues } from "@/data/schemas/auth";
import type { FormStatus } from "@/data/types/form-status";
import { PasswordField } from "@/components/PasswordField";

type LoginFormProps = {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  status: FormStatus;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onForgotPassword?: () => void;
};

export const LoginForm = ({
  register,
  errors,
  status,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) => {
  const isSubmitting = status === "submitting";

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder="contato@email.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          disabled={isSubmitting}
          className="h-10 rounded-[5px] border-border bg-transparent px-4 font-mono text-sm placeholder:text-secondary"
          {...register("email")}
        />
        {errors.email && (
          <p className="font-mono text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <PasswordField
          placeholder="***********"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          disabled={isSubmitting}
          {...register("password")}
        />
        {errors.password && (
          <p className="font-mono text-xs text-error">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="font-mono text-sm leading-4 text-foreground outline-none transition-colors hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          Esqueceu a senha?
        </button>
      </div>

      <FormStatusMessage
        status={status}
        submittingMessage="Validando credenciais..."
        errorMessage="Não foi possível entrar. Verifique os dados e tente novamente."
        successMessage="Login concluído."
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-11.25 w-full rounded-[5px] font-mono text-base font-bold"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

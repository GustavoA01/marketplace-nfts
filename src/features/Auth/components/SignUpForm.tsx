import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormStatusMessage } from "@/components/FormStatusMessage";
import type { SignUpFormValues } from "@/data/schemas/auth";
import type { FormStatus } from "@/data/types/form-status";
import { PasswordField } from "@/components/PasswordField";

type SignUpFormProps = {
  register: UseFormRegister<SignUpFormValues>;
  errors: FieldErrors<SignUpFormValues>;
  status: FormStatus;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const SignUpForm = ({
  register,
  errors,
  status,
  onSubmit,
}: SignUpFormProps) => {
  const isSubmitting = status === "submitting";

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          placeholder="Nome de usuário"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          disabled={isSubmitting}
          className="h-10 rounded-[5px] border-border bg-transparent px-4 font-mono text-sm placeholder:text-secondary"
          {...register("username")}
        />
        {errors.username && (
          <p className="font-mono text-xs text-error">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder="Digite seu e-mail"
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
          placeholder="Senha"
          autoComplete="new-password"
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

      <div className="flex flex-col gap-1">
        <PasswordField
          placeholder="Confirmar senha"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={isSubmitting}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="font-mono text-xs text-error">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <FormStatusMessage
        status={status}
        submittingMessage="Criando conta..."
        errorMessage="Não foi possível criar a conta. Verifique os dados e tente novamente."
        successMessage="Conta criada."
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 h-11.25 w-full rounded-[5px] font-mono text-base font-bold"
      >
        {isSubmitting ? "Criando..." : "Criar conta"}
      </Button>
    </form>
  );
};

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldError } from "@/components/FieldError";
import { PasswordField } from "@/components/PasswordField";
import { useLoginForm } from "@/features/Auth/hooks/useLoginForm";

type LoginFormProps = {
  redirectTo?: string;
  onAuthenticated?: () => void;
};

export const LoginForm = ({ redirectTo, onAuthenticated }: LoginFormProps) => {
  const { formId, register, errors, isSubmitting, onSubmit, onForgotPassword } =
    useLoginForm(redirectTo, onAuthenticated);

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-email`} className="sr-only">
          E-mail
        </label>
        <Input
          id={`${formId}-email`}
          required
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          type="email"
          placeholder="contato@email.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          disabled={isSubmitting}
          className="h-[50px] rounded-[10px] border-border bg-transparent px-4 font-mono text-sm placeholder:text-secondary lg:h-10 lg:rounded-[5px]"
          {...register("email")}
        />
        <FieldError
          id={`${formId}-email-error`}
          message={errors.email?.message}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-password`} className="sr-only">
          Senha
        </label>
        <PasswordField
          id={`${formId}-password`}
          required
          aria-describedby={
            errors.password ? `${formId}-password-error` : undefined
          }
          placeholder="***********"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          disabled={isSubmitting}
          className="h-[50px] rounded-[10px] lg:h-10 lg:rounded-[5px]"
          {...register("password")}
        />
        <FieldError
          id={`${formId}-password-error`}
          message={errors.password?.message}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="font-mono text-sm leading-4 text-text-accent outline-none transition-colors hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring lg:text-foreground lg:hover:text-text-accent"
        >
          Esqueceu a senha?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-[60px] w-full rounded-[10px] font-mono text-base font-bold lg:mt-6 lg:h-11.25 lg:rounded-[5px]"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

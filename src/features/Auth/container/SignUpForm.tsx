import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldError } from "@/components/FieldError";
import { PasswordField } from "@/components/PasswordField";
import { useSignupForm } from "@/features/Auth/hooks/useSignupForm";

export const SignUpForm = () => {
  const { formId, register, errors, isSubmitting, onSubmit } = useSignupForm();

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-username`} className="sr-only">
          Nome de usuário
        </label>
        <Input
          id={`${formId}-username`}
          required
          aria-describedby={
            errors.username ? `${formId}-username-error` : undefined
          }
          type="text"
          placeholder="Nome de usuário"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          disabled={isSubmitting}
          className="h-[50px] rounded-[10px] border-border bg-transparent px-4 font-mono text-sm placeholder:text-secondary lg:h-10 lg:rounded-[5px]"
          {...register("username")}
        />
        <FieldError
          id={`${formId}-username-error`}
          message={errors.username?.message}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-email`} className="sr-only">
          E-mail
        </label>
        <Input
          id={`${formId}-email`}
          required
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          type="email"
          placeholder="Digite seu e-mail"
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
          placeholder="Senha"
          autoComplete="new-password"
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

      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-confirmPassword`} className="sr-only">
          Confirmar senha
        </label>
        <PasswordField
          id={`${formId}-confirmPassword`}
          required
          aria-describedby={
            errors.confirmPassword
              ? `${formId}-confirmPassword-error`
              : undefined
          }
          placeholder="Confirmar senha"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={isSubmitting}
          className="h-[50px] rounded-[10px] lg:h-10 lg:rounded-[5px]"
          {...register("confirmPassword")}
        />
        <FieldError
          id={`${formId}-confirmPassword-error`}
          message={errors.confirmPassword?.message}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 h-[60px] w-full rounded-[10px] font-mono text-base font-bold lg:h-11.25 lg:rounded-[5px]"
      >
        {isSubmitting ? (
          "Criando..."
        ) : (
          <>
            <span className="lg:hidden">Criar perfil</span>
            <span className="hidden lg:inline">Criar conta</span>
          </>
        )}
      </Button>
    </form>
  );
};

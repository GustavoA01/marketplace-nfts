import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { signUpSchema, type SignUpFormValues } from "@/data/schemas/auth"
import { PasswordField } from "@/features/Auth/container/PasswordField"

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        <Input
          type="text"
          placeholder="Nome de usuário"
          aria-invalid={Boolean(errors.username)}
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
          aria-invalid={Boolean(errors.email)}
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
          aria-invalid={Boolean(errors.password)}
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
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="font-mono text-xs text-error">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="mt-3 h-11.25 w-full rounded-[5px] font-mono text-base font-bold"
      >
        Criar conta
      </Button>
    </form>
  )
}

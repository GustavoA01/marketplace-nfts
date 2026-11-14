import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { loginSchema, type LoginFormValues } from "@/data/schemas/auth"
import { PasswordField } from "@/features/Auth/container/PasswordField"

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        <Input
          type="email"
          placeholder="contato@email.com"
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
          placeholder="***********"
          aria-invalid={Boolean(errors.password)}
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
          className="font-mono text-sm leading-4 text-foreground outline-none transition-colors hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          Esqueceu a senha?
        </button>
      </div>

      <Button
        type="submit"
        className="mt-6 h-11.25 w-full rounded-[5px] font-mono text-base font-bold"
      >
        Entrar
      </Button>
    </form>
  )
}

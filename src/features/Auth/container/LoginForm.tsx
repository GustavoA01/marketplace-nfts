import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/data/schemas/auth";
import type { FormStatus } from "@/data/types/form-status";
import { LoginForm as LoginFormView } from "@/features/Auth/components/LoginForm";

export const LoginForm = () => {
  const [status, setStatus] = useState<FormStatus>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((data) => {
    setStatus("submitting");
    console.log(data);
    window.setTimeout(() => {
      setStatus("idle");
    }, 600);
  });

  return (
    <LoginFormView
      register={register}
      errors={errors}
      status={status}
      onSubmit={onSubmit}
      onForgotPassword={() => {
        console.log("Recuperação de senha fora do escopo desta etapa");
      }}
    />
  );
};

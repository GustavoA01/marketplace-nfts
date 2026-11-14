import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpFormValues } from "@/data/schemas/auth";
import type { FormStatus } from "@/data/types/form-status";
import { SignUpForm as SignUpFormView } from "@/features/Auth/components/SignUpForm";

export const SignUpForm = () => {
  const [status, setStatus] = useState<FormStatus>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = handleSubmit((data) => {
    setStatus("submitting");
    console.log(data);
    window.setTimeout(() => {
      setStatus("idle");
    }, 600);
  });

  return (
    <SignUpFormView
      register={register}
      errors={errors}
      status={status}
      onSubmit={onSubmit}
    />
  );
};

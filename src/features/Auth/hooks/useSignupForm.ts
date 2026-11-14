import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { queryKeys } from "@/data/query-keys";
import { signUpSchema, type SignUpFormValues } from "@/data/schemas/auth";
import type { AuthApiError } from "@/data/types/auth";
import { registerUser } from "@/services/auth/sign-up";

export const useSignupForm = () => {
  const formId = useId();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) });

  const { mutate, isPending } = useMutation({
    mutationKey: queryKeys.auth.register,
    mutationFn: registerUser,
    retry: false,
    onSuccess: () => toast.success("Conta criada. Agora faça login."),
    onError: (error) => {
      if (!isAxiosError<AuthApiError>(error)) {
        toast.error("Não foi possível criar a conta. Tente novamente.");
        return;
      }

      const { message, errors: fieldErrors } = error.response?.data ?? {};

      const fields = [
        "username",
        "email",
        "password",
        "confirmPassword",
      ] as const;

      for (const field of fields) {
        const fieldMessage = fieldErrors?.[field];
        if (fieldMessage)
          setError(field, { type: "server", message: fieldMessage });
      }

      toast.error(
        message ?? "Não foi possível criar a conta. Tente novamente.",
      );
    },
  });

  return {
    formId,
    register,
    errors,
    isSubmitting: isPending,
    onSubmit: handleSubmit((data) => mutate(data)),
  };
};

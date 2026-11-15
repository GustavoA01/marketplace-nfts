import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { queryKeys } from "@/data/query-keys";
import { loginSchema, type LoginFormValues } from "@/data/schemas/auth";
import type { AuthApiError } from "@/data/types/auth";
import { loginUser } from "@/services/auth/login";
import { safeReturnTo } from "../utils/navigation";
import { setSessionUser } from "../utils/session";

export const useLoginForm = (
  redirectTo?: string,
  onAuthenticated?: () => void,
) => {
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const formId = useId();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const { mutate, isPending } = useMutation({
    mutationKey: queryKeys.auth.login,
    mutationFn: loginUser,
    retry: false,
    onSuccess: async ({ user }) => {
      await setSessionUser(user);
      onAuthenticated?.();
      toast.success("Login concluído com sucesso!");
      const destination =
        safeReturnTo(redirectTo) ??
        safeReturnTo((location.search as Record<string, unknown>).redirect);
      if (destination || /^\/(login|cadastro)(\/|$)/.test(location.pathname)) {
        const defaultDestination = window.matchMedia("(min-width: 1024px)")
          .matches
          ? "/perfil"
          : "/";
        await navigate({ to: destination ?? defaultDestination });
      }
    },
    onError: (error) => {
      if (!isAxiosError<AuthApiError>(error)) {
        toast.error(
          "Não foi possível entrar. Verifique os dados e tente novamente.",
        );
        return;
      }

      const { message, errors: fieldErrors } = error.response?.data ?? {};

      for (const field of ["email", "password"] as const) {
        const fieldMessage = fieldErrors?.[field];
        if (fieldMessage)
          setError(field, { type: "server", message: fieldMessage });
      }

      toast.error(
        message ??
          "Não foi possível entrar. Verifique os dados e tente novamente.",
      );
    },
  });

  return {
    formId,
    register,
    errors,
    isSubmitting: isPending,
    onSubmit: handleSubmit((data) => mutate(data)),
    onForgotPassword: () => {
      console.log("Recuperação de senha fora do escopo desta etapa");
    },
  };
};

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import type { AuthUser } from "@/data/types/auth";
import { clearCheckoutDraft } from "@/lib/checkout-draft";
import { queryKeys } from "@/data/query-keys";
import { logoutUser } from "@/services/auth/logout";
import { setSessionUser } from "../utils/session";

export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: queryKeys.auth.logout,
    mutationFn: logoutUser,
    retry: false,
    onSuccess: async () => {
      const owner = queryClient.getQueryData<AuthUser | null>(
        queryKeys.auth.session,
      );
      if (owner) clearCheckoutDraft(owner.id);
      await navigate({ to: "/" });
      await setSessionUser(null);
      toast.success("Você saiu da sua conta.");
    },
    onError: () => toast.error("Não foi possível sair. Tente novamente."),
  });
};

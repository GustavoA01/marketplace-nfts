import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { UseFormReset, UseFormSetError } from "react-hook-form";
import { queryKeys } from "@/data/query-keys";
import type { WalletFormValues } from "@/data/schemas/wallets";
import type { AuthUser } from "@/data/types/auth";
import type { FormStatus } from "@/data/types/form-status";
import type { Wallet, WalletApiError } from "@/data/types/wallets";
import { queryClient } from "@/lib/query-client";
import { createWallet } from "@/services/wallets/create";
import { updateWallet } from "@/services/wallets/update";

type SaveWalletVariables = {
  values: WalletFormValues;
  ownerId: string;
};

type UseWalletsMutationsParams = {
  mainWallet?: Wallet;
  secondaryWallet?: Wallet;
  mainForm: {
    reset: UseFormReset<WalletFormValues>;
    setError: UseFormSetError<WalletFormValues>;
  };
  secondaryForm: {
    reset: UseFormReset<WalletFormValues>;
    setError: UseFormSetError<WalletFormValues>;
  };
  setMainStatus: (status: FormStatus) => void;
  setSecondaryStatus: (status: FormStatus) => void;
  setMainErrorMessage: (message: string | undefined) => void;
  setSecondaryErrorMessage: (message: string | undefined) => void;
  setSecondaryFormOpened: (open: boolean) => void;
};

const toFormValues = (wallet: Wallet): WalletFormValues => ({
  displayName: wallet.displayName,
  alias: wallet.alias,
  network: wallet.network,
  profileName: wallet.profileName,
  address: wallet.address,
  secondaryAddress: wallet.secondaryAddress ?? "",
  walletType: wallet.walletType,
  referralCode: wallet.referralCode ?? "",
  email: wallet.email,
  ensSuffix: wallet.ensSuffix,
  ensName: wallet.ensName ?? "",
});

const applyWalletFieldErrors = (
  setError: UseFormSetError<WalletFormValues>,
  error: unknown,
) => {
  if (!isAxiosError<WalletApiError>(error)) return;
  const fieldErrors = error.response?.data?.errors;
  if (!fieldErrors) return;
  for (const field of Object.keys(fieldErrors) as Array<
    keyof WalletFormValues | "kind"
  >) {
    if (field === "kind") continue;
    const message = fieldErrors[field];
    if (message) setError(field, { type: "server", message });
  }
};

const apiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError<WalletApiError>(error)) return fallback;
  return error.response?.data?.message ?? fallback;
};

const isCurrentOwner = (ownerId: string) => {
  const session = queryClient.getQueryData<AuthUser | null>(
    queryKeys.auth.session,
  );
  return Boolean(session && session.id === ownerId);
};

const syncWalletCache = (ownerId: string, wallet: Wallet) => {
  queryClient.setQueryData(
    queryKeys.wallets.list(ownerId),
    (current: Wallet[] | undefined) => {
      if (!current) return [wallet];
      const index = current.findIndex(
        (entry: Wallet) => entry.id === wallet.id,
      );
      if (index >= 0) {
        const next = [...current];
        next[index] = wallet;
        return next;
      }
      return [...current, wallet];
    },
  );
};

export const useWalletsMutations = ({
  mainWallet,
  secondaryWallet,
  mainForm,
  secondaryForm,
  setMainStatus,
  setSecondaryStatus,
  setMainErrorMessage,
  setSecondaryErrorMessage,
  setSecondaryFormOpened,
}: UseWalletsMutationsParams) => {
  const mainMutation = useMutation({
    mutationKey: queryKeys.wallets.create,
    mutationFn: ({ values }: SaveWalletVariables) =>
      mainWallet
        ? updateWallet(mainWallet.id, values)
        : createWallet({ ...values, kind: "main" }),
    retry: false,
    onMutate: () => {
      setMainErrorMessage(undefined);
      setMainStatus("submitting");
    },
    onSuccess: (wallet, variables) => {
      if (!isCurrentOwner(variables.ownerId)) return;
      syncWalletCache(variables.ownerId, wallet);
      mainForm.reset(toFormValues(wallet));
      setMainStatus("success");
    },
    onError: (error) => {
      applyWalletFieldErrors(mainForm.setError, error);
      setMainErrorMessage(
        apiErrorMessage(
          error,
          "Não foi possível salvar a carteira. Tente novamente.",
        ),
      );
      setMainStatus("error");
    },
  });

  const secondaryMutation = useMutation({
    mutationKey: queryKeys.wallets.update,
    mutationFn: ({ values }: SaveWalletVariables) =>
      secondaryWallet
        ? updateWallet(secondaryWallet.id, values)
        : createWallet({ ...values, kind: "secondary" }),
    retry: false,
    onMutate: () => {
      setSecondaryErrorMessage(undefined);
      setSecondaryStatus("submitting");
    },
    onSuccess: (wallet, variables) => {
      if (!isCurrentOwner(variables.ownerId)) return;
      syncWalletCache(variables.ownerId, wallet);
      secondaryForm.reset(toFormValues(wallet));
      setSecondaryFormOpened(true);
      setSecondaryStatus("success");
    },
    onError: (error) => {
      applyWalletFieldErrors(secondaryForm.setError, error);
      setSecondaryErrorMessage(
        apiErrorMessage(
          error,
          "Não foi possível salvar a carteira secundária. Tente novamente.",
        ),
      );
      setSecondaryStatus("error");
    },
  });

  return {
    saveMain: (values: WalletFormValues, ownerId: string) => {
      mainMutation.mutate({ values, ownerId });
    },
    saveSecondary: (values: WalletFormValues, ownerId: string) => {
      secondaryMutation.mutate({ values, ownerId });
    },
  };
};

export { toFormValues };

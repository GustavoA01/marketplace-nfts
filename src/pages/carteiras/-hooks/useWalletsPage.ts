import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { queryKeys } from "@/data/query-keys";
import type { FormStatus } from "@/data/types/form-status";
import { useSession } from "@/features/Auth/hooks/useSession";
import { getWallets } from "@/services/wallets/list";
import { useWalletsForms } from "./useWalletsForms";
import { useWalletsMutations } from "./useWalletsMutations";

export const useWalletsPage = () => {
  const { data: session } = useSession();
  const userId = session?.id;
  const previousUserIdRef = useRef(userId);
  const [mainStatus, setMainStatus] = useState<FormStatus>("idle");
  const [secondaryStatus, setSecondaryStatus] = useState<FormStatus>("idle");
  const [mainErrorMessage, setMainErrorMessage] = useState<string>();
  const [secondaryErrorMessage, setSecondaryErrorMessage] = useState<string>();

  const {
    data: wallets,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.wallets.list(userId ?? ""),
    queryFn: ({ signal }) => getWallets(signal),
    enabled: Boolean(userId),
    retry: false,
  });

  const mainWallet = wallets?.find((wallet) => wallet.kind === "main");
  const secondaryWallet = wallets?.find(
    (wallet) => wallet.kind === "secondary",
  );

  const {
    mainForm,
    secondaryForm,
    sameAsMain,
    hasSecondaryWallet,
    isEditingSecondary,
    setSecondaryFormOpened,
    buildSecondarySubmitValues,
    openSecondaryForm,
    onSameAsMainChange: syncSameAsMain,
  } = useWalletsForms({
    userId,
    wallets,
    mainWallet,
    secondaryWallet,
  });

  const { saveMain, saveSecondary } = useWalletsMutations({
    mainWallet,
    secondaryWallet,
    mainForm,
    secondaryForm,
    setMainStatus,
    setSecondaryStatus,
    setMainErrorMessage,
    setSecondaryErrorMessage,
    setSecondaryFormOpened,
  });

  useEffect(() => {
    if (previousUserIdRef.current === userId) return;
    previousUserIdRef.current = userId;
    setMainStatus("idle");
    setSecondaryStatus("idle");
    setMainErrorMessage(undefined);
    setSecondaryErrorMessage(undefined);
  }, [userId]);

  const onMainSubmit = mainForm.handleSubmit((values) => {
    if (!userId) return;
    saveMain(values, userId);
  });

  const onSecondarySubmit = secondaryForm.handleSubmit((data) => {
    if (!userId) return;
    saveSecondary(buildSecondarySubmitValues(data), userId);
  });

  const onAddSecondary = () => {
    openSecondaryForm();
    setSecondaryStatus("idle");
    setSecondaryErrorMessage(undefined);
  };

  const onSameAsMainChange = (checked: boolean) => {
    syncSameAsMain(checked);
    if (checked) setSecondaryStatus("idle");
  };

  return {
    isPending,
    isError,
    isFetching,
    refetch,
    mainForm,
    secondaryForm,
    mainWallet,
    secondaryWallet,
    hasSecondaryWallet,
    isEditingSecondary,
    sameAsMain,
    mainStatus,
    secondaryStatus,
    mainErrorMessage,
    secondaryErrorMessage,
    mainSubmitLabel: mainWallet ? "Salvar alterações" : "Salvar carteira",
    secondarySubmitLabel: secondaryWallet
      ? "Salvar alterações"
      : "Salvar carteira",
    onMainSubmit,
    onSecondarySubmit,
    onAddSecondary,
    onSameAsMainChange,
  };
};

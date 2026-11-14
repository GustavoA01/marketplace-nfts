import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { Button } from "@/components/ui/Button";
import { queryKeys } from "@/data/query-keys";
import { walletSchema, type WalletFormValues } from "@/data/schemas/wallets";
import type { FormStatus } from "@/data/types/form-status";
import type { Wallet, WalletApiError } from "@/data/types/wallets";
import { useSession } from "@/features/Auth/hooks/useSession";
import { queryClient } from "@/lib/query-client";
import { createWallet } from "@/services/wallets/create";
import { getWallets } from "@/services/wallets/list";
import { updateWallet } from "@/services/wallets/update";
import { MainWalletForm } from "./-components/MainWalletForm";
import { SecondaryWalletSection } from "./-components/SecondaryWalletSection";

const emptyWalletValues: WalletFormValues = {
  displayName: "",
  alias: "",
  network: "",
  profileName: "",
  address: "",
  secondaryAddress: "",
  walletType: "",
  referralCode: "",
  email: "",
  ensSuffix: ".eth",
  ensName: "",
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

const Page = () => {
  const { data: session } = useSession();
  const userId = session?.id;

  const [mainStatus, setMainStatus] = useState<FormStatus>("idle");
  const [secondaryStatus, setSecondaryStatus] = useState<FormStatus>("idle");
  const [secondaryFormOpened, setSecondaryFormOpened] = useState(false);
  const [sameAsMain, setSameAsMain] = useState(false);

  const mainForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: emptyWalletValues,
  });

  const secondaryForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: emptyWalletValues,
  });

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
  const hasSecondaryWallet = Boolean(secondaryWallet);
  const isEditingSecondary = hasSecondaryWallet || secondaryFormOpened;

  useEffect(() => {
    if (!wallets) return;
    mainForm.reset(mainWallet ? toFormValues(mainWallet) : emptyWalletValues);
    if (secondaryWallet) {
      secondaryForm.reset(toFormValues(secondaryWallet));
    }
  }, [wallets, mainWallet, secondaryWallet, mainForm, secondaryForm]);

  const syncWalletCache = (wallet: Wallet) => {
    if (!userId) return;
    queryClient.setQueryData<Wallet[]>(
      queryKeys.wallets.list(userId),
      (current) => {
        if (!current) return [wallet];
        const index = current.findIndex((entry) => entry.id === wallet.id);
        if (index >= 0) {
          const next = [...current];
          next[index] = wallet;
          return next;
        }
        return [...current, wallet];
      },
    );
  };

  const mainMutation = useMutation({
    mutationKey: queryKeys.wallets.create,
    mutationFn: (values: WalletFormValues) =>
      mainWallet
        ? updateWallet(mainWallet.id, values)
        : createWallet({ ...values, kind: "main" }),
    retry: false,
    onMutate: () => {
      setMainStatus("submitting");
    },
    onSuccess: (wallet) => {
      syncWalletCache(wallet);
      mainForm.reset(toFormValues(wallet));
      setMainStatus("success");
    },
    onError: (error) => {
      applyWalletFieldErrors(mainForm.setError, error);
      setMainStatus("error");
    },
  });

  const secondaryMutation = useMutation({
    mutationKey: queryKeys.wallets.update,
    mutationFn: (values: WalletFormValues) =>
      secondaryWallet
        ? updateWallet(secondaryWallet.id, values)
        : createWallet({ ...values, kind: "secondary" }),
    retry: false,
    onMutate: () => {
      setSecondaryStatus("submitting");
    },
    onSuccess: (wallet) => {
      syncWalletCache(wallet);
      secondaryForm.reset(toFormValues(wallet));
      setSecondaryFormOpened(true);
      setSecondaryStatus("success");
    },
    onError: (error) => {
      applyWalletFieldErrors(secondaryForm.setError, error);
      setSecondaryStatus("error");
    },
  });

  const onMainSubmit = mainForm.handleSubmit((data) => {
    mainMutation.mutate(data);
  });

  const onSecondarySubmit = secondaryForm.handleSubmit((data) => {
    secondaryMutation.mutate(data);
  });

  const copyMainToSecondary = () => {
    const mainValues = mainForm.getValues();
    secondaryForm.reset({
      ...mainValues,
      alias: mainValues.alias
        ? `${mainValues.alias} (secundária)`
        : "Carteira secundária",
    });
  };

  return (
    <>
      <AccountMobileBar title="Carteiras" />
      <div className="flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-start">
        <AccountSidebar active="wallets" />
        <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-8">
          {isPending ? (
            <p className="font-mono text-sm text-text-secondary" role="status">
              Carregando carteiras...
            </p>
          ) : isError ? (
            <div className="flex flex-col items-start gap-3" role="alert">
              <p className="font-mono text-sm text-destructive">
                Não foi possível carregar as carteiras.
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={isFetching}
                onClick={() => void refetch()}
                className="h-9 rounded-[3px] font-mono text-xs sm:h-10 sm:text-sm"
              >
                {isFetching ? "Tentando..." : "Tentar novamente"}
              </Button>
            </div>
          ) : (
            <>
              <MainWalletForm
                register={mainForm.register}
                errors={mainForm.formState.errors}
                watch={mainForm.watch}
                status={mainStatus}
                onSubmit={onMainSubmit}
                onAddClick={() => {
                  setMainStatus("idle");
                  mainForm.reset(
                    mainWallet ? toFormValues(mainWallet) : emptyWalletValues,
                  );
                }}
                onNetworkChange={(value) => {
                  mainForm.setValue("network", value, { shouldValidate: true });
                }}
                onWalletTypeChange={(value) => {
                  mainForm.setValue("walletType", value, {
                    shouldValidate: true,
                  });
                }}
                onEnsSuffixChange={(value) => {
                  mainForm.setValue("ensSuffix", value, {
                    shouldValidate: true,
                  });
                }}
              />
              <SecondaryWalletSection
                isEditing={isEditingSecondary}
                sameAsMain={sameAsMain}
                hasSecondaryWallet={hasSecondaryWallet}
                register={secondaryForm.register}
                errors={secondaryForm.formState.errors}
                watch={secondaryForm.watch}
                status={secondaryStatus}
                onSubmit={onSecondarySubmit}
                onAddClick={() => {
                  setSecondaryFormOpened(true);
                  setSecondaryStatus("idle");
                  if (!secondaryWallet) {
                    secondaryForm.reset(emptyWalletValues);
                  }
                }}
                onSameAsMainChange={(checked) => {
                  setSameAsMain(checked);
                  if (checked) {
                    setSecondaryFormOpened(true);
                    copyMainToSecondary();
                  }
                }}
                onNetworkChange={(value) => {
                  secondaryForm.setValue("network", value, {
                    shouldValidate: true,
                  });
                }}
                onWalletTypeChange={(value) => {
                  secondaryForm.setValue("walletType", value, {
                    shouldValidate: true,
                  });
                }}
                onEnsSuffixChange={(value) => {
                  secondaryForm.setValue("ensSuffix", value, {
                    shouldValidate: true,
                  });
                }}
              />
            </>
          )}
        </div>
      </div>
      <MobileBottomNavigation />
    </>
  );
};

export const Route = createFileRoute("/carteiras/")({
  beforeLoad: requireSession,
  component: Page,
});

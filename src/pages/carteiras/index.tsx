import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { walletSchema, type WalletFormValues } from "@/data/schemas/wallets";
import type { FormStatus } from "@/data/types/form-status";
import { MainWalletForm } from "./-components/MainWalletForm";
import { SecondaryWalletSection } from "./-components/SecondaryWalletSection";
import {
  mainWalletMock,
  secondaryWalletMock,
} from "@/data/mocks/temporary/wallets";

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

const Page = () => {
  const [mainStatus, setMainStatus] = useState<FormStatus>("idle");
  const [secondaryStatus, setSecondaryStatus] = useState<FormStatus>("idle");
  const [isEditingSecondary, setIsEditingSecondary] = useState(
    Boolean(secondaryWalletMock),
  );
  const [sameAsMain, setSameAsMain] = useState(false);
  const [hasSecondaryWallet] = useState(Boolean(secondaryWalletMock));

  const mainForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: mainWalletMock,
  });

  const secondaryForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: secondaryWalletMock ?? emptyWalletValues,
  });

  const onMainSubmit = mainForm.handleSubmit((data) => {
    setMainStatus("submitting");
    console.log({ scope: "main-wallet", ...data });
    window.setTimeout(() => {
      setMainStatus("idle");
    }, 600);
  });

  const onSecondarySubmit = secondaryForm.handleSubmit((data) => {
    setSecondaryStatus("submitting");
    console.log({ scope: "secondary-wallet", ...data });
    window.setTimeout(() => {
      setSecondaryStatus("idle");
    }, 600);
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
          <MainWalletForm
            register={mainForm.register}
            errors={mainForm.formState.errors}
            watch={mainForm.watch}
            status={mainStatus}
            onSubmit={onMainSubmit}
            onAddClick={() => {
              console.log(
                "Conexão de carteira principal fora do escopo desta etapa",
              );
            }}
            onNetworkChange={(value) => {
              mainForm.setValue("network", value, { shouldValidate: true });
            }}
            onWalletTypeChange={(value) => {
              mainForm.setValue("walletType", value, { shouldValidate: true });
            }}
            onEnsSuffixChange={(value) => {
              mainForm.setValue("ensSuffix", value, { shouldValidate: true });
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
              setIsEditingSecondary(true);
              console.log("Edição visual de carteira secundária iniciada");
            }}
            onSameAsMainChange={(checked) => {
              setSameAsMain(checked);
              if (checked) {
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

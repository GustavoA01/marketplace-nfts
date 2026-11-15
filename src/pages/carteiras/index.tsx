import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute } from "@tanstack/react-router";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { Button } from "@/components/ui/Button";
import { MainWalletForm } from "./-components/MainWalletForm";
import { SecondaryWalletSection } from "./-components/SecondaryWalletSection";
import { WalletsSkeleton } from "./-components/WalletsSkeleton";
import { useWalletsPage } from "./-hooks/useWalletsPage";

const Page = () => {
  const {
    isPending,
    isError,
    isFetching,
    refetch,
    mainForm,
    secondaryForm,
    hasSecondaryWallet,
    isEditingSecondary,
    sameAsMain,
    mainStatus,
    secondaryStatus,
    mainErrorMessage,
    secondaryErrorMessage,
    mainSubmitLabel,
    secondarySubmitLabel,
    onMainSubmit,
    onSecondarySubmit,
    onAddSecondary,
    onSameAsMainChange,
  } = useWalletsPage();

  return (
    <>
      <AccountMobileBar title="Carteiras" />
      <div className="flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-start">
        <AccountSidebar active="wallets" />
        <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-8">
          {isPending ? (
            <WalletsSkeleton />
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
                submitLabel={mainSubmitLabel}
                errorMessage={mainErrorMessage}
                onSubmit={onMainSubmit}
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
                submitLabel={secondarySubmitLabel}
                errorMessage={secondaryErrorMessage}
                onSubmit={onSecondarySubmit}
                onAddClick={onAddSecondary}
                onSameAsMainChange={onSameAsMainChange}
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

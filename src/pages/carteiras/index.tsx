import { ChevronLeft } from "lucide-react";
import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { Button } from "@/components/ui/Button";
import { MainWalletForm } from "./-components/MainWalletForm";
import { SecondaryWalletSection } from "./-components/SecondaryWalletSection";
import { WalletsSkeleton } from "./-components/WalletsSkeleton";
import { useWalletsPage } from "./-hooks/useWalletsPage";

const Page = () => {
  const { returnTo } = Route.useSearch();
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
      <AccountMobileBar
        title="Carteiras"
        backTo={returnTo ?? "/"}
        backLabel={returnTo ? "Voltar ao pagamento" : "Voltar"}
      />
      {returnTo && (
        <Button
          variant="link"
          nativeButton={false}
          render={<Link to={returnTo} />}
          className="mb-5 hidden h-auto p-0 text-sm lg:inline-flex"
        >
          <ChevronLeft className="size-4" />
          Voltar ao pagamento
        </Button>
      )}
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
                control={mainForm.control}
                register={mainForm.register}
                errors={mainForm.formState.errors}
                watch={mainForm.watch}
                status={mainStatus}
                submitLabel={mainSubmitLabel}
                errorMessage={mainErrorMessage}
                onSubmit={onMainSubmit}
                onEnsSuffixChange={(value) => {
                  mainForm.setValue("ensSuffix", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                }}
              />
              <SecondaryWalletSection
                isEditing={isEditingSecondary}
                sameAsMain={sameAsMain}
                hasSecondaryWallet={hasSecondaryWallet}
                control={secondaryForm.control}
                register={secondaryForm.register}
                errors={secondaryForm.formState.errors}
                watch={secondaryForm.watch}
                status={secondaryStatus}
                submitLabel={secondarySubmitLabel}
                errorMessage={secondaryErrorMessage}
                onSubmit={onSecondarySubmit}
                onAddClick={onAddSecondary}
                onSameAsMainChange={onSameAsMainChange}
                onEnsSuffixChange={(value) => {
                  secondaryForm.setValue("ensSuffix", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                    shouldTouch: true,
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
  validateSearch: (
    search: Record<string, unknown>,
  ): { returnTo?: "/pagamento" } => ({
    returnTo: search.returnTo === "/pagamento" ? "/pagamento" : undefined,
  }),
  component: Page,
});

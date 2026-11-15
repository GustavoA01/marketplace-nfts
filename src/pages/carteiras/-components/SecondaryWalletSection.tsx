import type { SubmitEventHandler } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormStatusMessage } from "@/components/FormStatusMessage";
import type { WalletFormValues } from "@/data/schemas/wallets";
import type { FormStatus } from "@/data/types/form-status";
import { WalletFormFields } from "./WalletFormFields";
import { cn } from "@/lib/utils";

type SecondaryWalletSectionProps = {
  isEditing: boolean;
  sameAsMain: boolean;
  hasSecondaryWallet: boolean;
  control: Control<WalletFormValues>;
  register: UseFormRegister<WalletFormValues>;
  errors: FieldErrors<WalletFormValues>;
  watch: UseFormWatch<WalletFormValues>;
  status: FormStatus;
  submitLabel: string;
  errorMessage?: string;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onAddClick: () => void;
  onSameAsMainChange: (checked: boolean) => void;
  onEnsSuffixChange: (value: ".eth" | ".xyz") => void;
};

export const SecondaryWalletSection = ({
  isEditing,
  sameAsMain,
  hasSecondaryWallet,
  control,
  register,
  errors,
  watch,
  status,
  submitLabel,
  errorMessage,
  onSubmit,
  onAddClick,
  onSameAsMainChange,
  onEnsSuffixChange,
}: SecondaryWalletSectionProps) => {
  const isSubmitting = status === "submitting";
  const ensNameRegister = register("ensName");
  const showAddButton = !hasSecondaryWallet && !isEditing;

  return (
    <section className="flex w-full flex-col gap-3 font-mono">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-sm leading-4 font-bold text-foreground sm:text-[17px]">
          Carteira secundária
        </h2>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <button
              type="button"
              role="checkbox"
              aria-checked={sameAsMain}
              onClick={() => onSameAsMainChange(!sameAsMain)}
              className={cn(
                "size-4 shrink-0 rounded-full border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring",
                sameAsMain && "border-primary bg-primary",
              )}
            />
            <span className="text-xs leading-4 text-foreground sm:text-sm">
              Igual à carteira principal
            </span>
          </label>
          {showAddButton && (
            <button
              type="button"
              onClick={onAddClick}
              className="text-sm leading-4 font-medium text-text-accent outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-ring sm:text-base"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>

      {!isEditing && !hasSecondaryWallet && (
        <p className="text-xs leading-4 text-text-secondary sm:text-sm sm:leading-[15px]">
          Você ainda não adicionou uma carteira secundária.
        </p>
      )}

      {isEditing && (
        <form
          className="mt-4 flex w-full flex-col gap-6 sm:mt-5 sm:gap-8"
          onSubmit={onSubmit}
          noValidate
        >
          <WalletFormFields
            idPrefix="secondary-wallet"
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            disabled={isSubmitting || sameAsMain}
            onEnsSuffixChange={onEnsSuffixChange}
            onEnsNameChange={ensNameRegister.onChange}
            ensNameName={ensNameRegister.name}
            ensNameRef={ensNameRegister.ref}
          />

          <FormStatusMessage
            status={status}
            submittingMessage="Salvando carteira secundária..."
            errorMessage={
              errorMessage ??
              "Não foi possível salvar a carteira secundária. Tente novamente."
            }
            successMessage="Carteira secundária salva."
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 w-full rounded-full px-6 font-mono text-xs font-bold text-ink sm:h-10 sm:w-fit sm:min-w-44 sm:rounded-[3px] sm:text-sm"
          >
            {isSubmitting ? "Salvando..." : submitLabel}
          </Button>
        </form>
      )}
    </section>
  );
};

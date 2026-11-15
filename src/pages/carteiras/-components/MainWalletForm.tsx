import type { FormEventHandler } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormStatusMessage } from "@/components/FormStatusMessage";
import type { WalletFormValues } from "@/data/schemas/wallets";
import type { FormStatus } from "@/data/types/form-status";
import { WalletFormFields } from "./WalletFormFields";

type MainWalletFormProps = {
  register: UseFormRegister<WalletFormValues>;
  errors: FieldErrors<WalletFormValues>;
  watch: UseFormWatch<WalletFormValues>;
  status: FormStatus;
  submitLabel: string;
  errorMessage?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onNetworkChange: (value: string) => void;
  onWalletTypeChange: (value: string) => void;
  onEnsSuffixChange: (value: ".eth" | ".xyz") => void;
};

export const MainWalletForm = ({
  register,
  errors,
  watch,
  status,
  submitLabel,
  errorMessage,
  onSubmit,
  onNetworkChange,
  onWalletTypeChange,
  onEnsSuffixChange,
}: MainWalletFormProps) => {
  const isSubmitting = status === "submitting";
  const ensNameRegister = register("ensName");

  return (
    <form
      className="flex w-full flex-col gap-6 font-mono sm:gap-8"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-sm leading-4 font-bold text-foreground sm:text-[17px]">
          Carteira principal
        </h1>
        <p className="text-xs leading-4 text-text-secondary sm:text-sm sm:leading-[15px]">
          Estas carteiras ficam disponíveis no pagamento e para receber NFTs
          comprados.
        </p>
      </div>

      <WalletFormFields
        idPrefix="main-wallet"
        register={register}
        errors={errors}
        watch={watch}
        disabled={isSubmitting}
        onNetworkChange={onNetworkChange}
        onWalletTypeChange={onWalletTypeChange}
        onEnsSuffixChange={onEnsSuffixChange}
        onEnsNameChange={ensNameRegister.onChange}
        ensNameName={ensNameRegister.name}
        ensNameRef={ensNameRegister.ref}
      />

      <FormStatusMessage
        status={status}
        submittingMessage="Salvando carteira..."
        errorMessage={
          errorMessage ?? "Não foi possível salvar a carteira. Tente novamente."
        }
        successMessage="Carteira salva."
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-9 w-full rounded-full px-6 font-mono text-xs font-bold text-ink sm:h-10 sm:w-fit sm:min-w-44 sm:rounded-[3px] sm:text-sm"
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
};

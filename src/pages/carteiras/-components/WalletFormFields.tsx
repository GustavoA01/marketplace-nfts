import type { ChangeEventHandler, Ref } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { EnsNameField } from "@/components/EnsNameField";
import { FormField } from "@/components/FormField";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type { WalletFormValues } from "@/data/schemas/wallets";
import { networkOptions, walletTypeOptions } from "@/mocks/temporary/wallets";

type WalletFormFieldsProps = {
  idPrefix: string;
  register: UseFormRegister<WalletFormValues>;
  errors: FieldErrors<WalletFormValues>;
  watch: UseFormWatch<WalletFormValues>;
  disabled?: boolean;
  onNetworkChange: (value: string) => void;
  onWalletTypeChange: (value: string) => void;
  onEnsSuffixChange: (value: ".eth" | ".xyz") => void;
  onEnsNameChange: ChangeEventHandler<HTMLInputElement>;
  ensNameName?: string;
  ensNameRef?: Ref<HTMLInputElement>;
};

export const WalletFormFields = ({
  idPrefix,
  register,
  errors,
  watch,
  disabled = false,
  onNetworkChange,
  onWalletTypeChange,
  onEnsSuffixChange,
  onEnsNameChange,
  ensNameName,
  ensNameRef,
}: WalletFormFieldsProps) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 md:gap-x-7">
        <FormField
          label="Nome de exibição"
          htmlFor={`${idPrefix}-displayName`}
          required
          error={errors.displayName?.message}
          className="gap-1.5"
        >
          <Input
            id={`${idPrefix}-displayName`}
            disabled={disabled}
            aria-invalid={Boolean(errors.displayName)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("displayName")}
          />
        </FormField>

        <FormField
          label="Apelido da carteira"
          htmlFor={`${idPrefix}-alias`}
          required
          error={errors.alias?.message}
          className="gap-1.5"
        >
          <Input
            id={`${idPrefix}-alias`}
            disabled={disabled}
            aria-invalid={Boolean(errors.alias)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("alias")}
          />
        </FormField>

        <FormField
          label="Rede"
          required
          error={errors.network?.message}
          className="gap-1.5"
        >
          <Select
            value={watch("network") || undefined}
            onValueChange={(value) => {
              if (value) {
                onNetworkChange(value);
              }
            }}
            items={[...networkOptions]}
            disabled={disabled}
          >
            <SelectTrigger className="h-9 w-full rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:text-sm text-foreground data-placeholder:text-secondary dark:bg-transparent dark:hover:bg-transparent">
              <SelectValue placeholder="Selecione uma rede" />
            </SelectTrigger>
            <SelectContent>
              {networkOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Nome do perfil"
          htmlFor={`${idPrefix}-profileName`}
          required
          error={errors.profileName?.message}
          className="gap-1.5"
        >
          <Input
            id={`${idPrefix}-profileName`}
            disabled={disabled}
            aria-invalid={Boolean(errors.profileName)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("profileName")}
          />
        </FormField>

        <FormField
          label="Endereço da carteira"
          htmlFor={`${idPrefix}-address`}
          required
          error={errors.address?.message}
          className="gap-1.5"
        >
          <Input
            id={`${idPrefix}-address`}
            disabled={disabled}
            placeholder="Endereço 0x da carteira"
            aria-invalid={Boolean(errors.address)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("address")}
          />
        </FormField>

        <FormField
          label="ENS ou carteira secundária"
          htmlFor={`${idPrefix}-secondaryAddress`}
          error={errors.secondaryAddress?.message}
          className="justify-end gap-1.5"
        >
          <Input
            id={`${idPrefix}-secondaryAddress`}
            disabled={disabled}
            placeholder="ENS ou carteira secundária (opcional)"
            aria-invalid={Boolean(errors.secondaryAddress)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("secondaryAddress")}
          />
        </FormField>

        <FormField
          label="Tipo de carteira"
          required
          error={errors.walletType?.message}
          className="gap-1.5"
        >
          <Select
            value={watch("walletType") || undefined}
            onValueChange={(value) => {
              if (value) {
                onWalletTypeChange(value);
              }
            }}
            items={[...walletTypeOptions]}
            disabled={disabled}
          >
            <SelectTrigger className="h-9 w-full rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:text-sm text-foreground data-placeholder:text-secondary dark:bg-transparent dark:hover:bg-transparent">
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {walletTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Código de indicação"
          htmlFor={`${idPrefix}-referralCode`}
          required
          error={errors.referralCode?.message}
          className="gap-1.5"
        >
          <Input
            id={`${idPrefix}-referralCode`}
            disabled={disabled}
            aria-invalid={Boolean(errors.referralCode)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("referralCode")}
          />
        </FormField>

        <FormField
          label="E-mail"
          htmlFor={`${idPrefix}-email`}
          required
          error={errors.email?.message}
          className="gap-1.5"
        >
          <Input
            id={`${idPrefix}-email`}
            type="email"
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs sm:h-10 sm:px-4 sm:text-sm placeholder:text-secondary"
            {...register("email")}
          />
        </FormField>

        <EnsNameField
          ensName={watch("ensName")}
          ensSuffix={watch("ensSuffix")}
          ensNameError={errors.ensName?.message}
          ensSuffixError={errors.ensSuffix?.message}
          disabled={disabled}
          onEnsNameChange={onEnsNameChange}
          onEnsSuffixChange={onEnsSuffixChange}
          ensNameName={ensNameName}
          ensNameRef={ensNameRef}
        />
      </div>
    </div>
  );
};

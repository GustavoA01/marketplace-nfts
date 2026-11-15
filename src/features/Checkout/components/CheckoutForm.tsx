import { useState } from "react";
import type { Wallet } from "@/data/types/wallets";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CollectorValues } from "@/data/schemas/orders";
import { networkOptions, walletTypeOptions } from "@/data/schemas/wallets";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/FieldError";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { SavedWallets } from "./SavedWallets";

type CheckoutFormProps = {
  wallet?: Wallet;
  wallets: Wallet[];
  onWalletChange: (id: string) => void;
  register: UseFormRegister<CollectorValues>;
  errors: FieldErrors<CollectorValues>;
  disabled: boolean;
};

const inputClass =
  "h-10 data-[size=default]:h-10 rounded-[3px] border-border bg-transparent px-3 text-sm shadow-none placeholder:text-secondary dark:bg-transparent";

export const CheckoutForm = ({
  wallet,
  wallets,
  onWalletChange,
  register,
  errors,
  disabled,
}: CheckoutFormProps) => {
  const [showWallets, setShowWallets] = useState(false);
  const collector = (
    field: "displayName" | "username" | "profileName" | "email",
    label: string,
  ) => (
    <div className="min-w-0">
      <Label
        htmlFor={`checkout-${field}`}
        className="flex min-h-7.25 items-center text-[15px] font-normal"
      >
        {label}
        <span className="text-[22px] leading-[29px] text-[#F0805F]">*</span>
      </Label>
      <Input
        id={`checkout-${field}`}
        type={field === "email" ? "email" : "text"}
        className={inputClass}
        disabled={disabled}
        aria-invalid={Boolean(errors[field])}
        aria-describedby={errors[field] ? `checkout-${field}-error` : undefined}
        {...register(field)}
      />
      <FieldError
        id={`checkout-${field}-error`}
        message={errors[field]?.message}
      />
    </div>
  );

  const readonly = (
    id: string,
    label: string,
    value: string,
    placeholder: string,
    required = false,
  ) => (
    <div className="min-w-0">
      <Label
        htmlFor={`checkout-${id}`}
        className="flex min-h-7.25 items-center text-[15px] font-normal"
      >
        {label || (
          <span className="sr-only">ENS ou carteira secundária (opcional)</span>
        )}
        {required && (
          <span className="text-[22px] leading-[29px] text-[#F0805F]">*</span>
        )}
      </Label>
      <Input
        id={`checkout-${id}`}
        readOnly
        value={value}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  return (
    <section>
      <h1 className="mb-3 text-[17px] leading-4 font-bold">
        Perfil do colecionador
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {collector("displayName", "Nome de exibição")}
        {collector("username", "Nome de usuário")}
        <div>
          <Label
            htmlFor="checkout-network"
            className="flex min-h-7.25 items-center text-[15px] font-normal"
          >
            Rede
            <span className="text-[22px] leading-[29px] text-[#F0805F]">*</span>
          </Label>
          <Select
            value={wallet?.network ?? null}
            items={[...networkOptions]}
            disabled={disabled}
            onValueChange={(value) => {
              const match = wallets.find((entry) => entry.network === value);
              if (match) onWalletChange(match.id);
            }}
          >
            <SelectTrigger
              id="checkout-network"
              className={`${inputClass} w-full`}
            >
              <SelectValue placeholder="Selecione uma rede" />
            </SelectTrigger>
            <SelectContent>
              {networkOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={
                    !wallets.some((entry) => entry.network === option.value)
                  }
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {collector("profileName", "Nome do perfil")}
        {readonly(
          "address",
          "Endereço da carteira",
          wallet?.address ?? "",
          "Endereço 0x da carteira",
          true,
        )}

        {readonly(
          "secondary",
          "",
          wallet?.secondaryAddress ?? "",
          "ENS ou carteira secundária (opcional)",
        )}

        <div>
          <Label
            htmlFor="checkout-type"
            className="flex min-h-7.25 items-center text-[15px] font-normal"
          >
            Tipo de carteira
            <span className="text-[22px] leading-7.25 text-[#F0805F]">*</span>
          </Label>
          <Select
            value={wallet?.walletType ?? null}
            items={[...walletTypeOptions]}
            disabled={disabled}
            onValueChange={(value) => {
              const match =
                wallets.find(
                  (entry) =>
                    entry.walletType === value &&
                    entry.network === wallet?.network,
                ) ?? wallets.find((entry) => entry.walletType === value);
              if (match) onWalletChange(match.id);
            }}
          >
            <SelectTrigger
              id="checkout-type"
              className={`${inputClass} w-full`}
            >
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {walletTypeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={
                    !wallets.some((entry) => entry.walletType === option.value)
                  }
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {readonly(
          "referral",
          "Código de indicação",
          wallet?.referralCode ?? "",
          "",
        )}

        {collector("email", "E-mail")}

        <div className="w-24">
          {readonly("ens", "Nome ENS", wallet?.ensSuffix ?? ".eth", ".eth")}
        </div>
      </div>

      <Label
        htmlFor="checkout-other-wallet"
        className="mt-6 flex items-center gap-2 text-[15px] font-normal"
      >
        <Input
          id="checkout-other-wallet"
          type="checkbox"
          checked={showWallets}
          disabled={disabled}
          onChange={(event) => setShowWallets(event.target.checked)}
          className="size-4 accent-primary"
        />
        Usar outra carteira?
      </Label>

      {showWallets && (
        <div className="mt-4">
          <SavedWallets
            wallets={wallets}
            idPrefix="checkout-form"
            selectedId={wallet?.id}
            disabled={disabled}
            onSelect={onWalletChange}
          />
        </div>
      )}
      <div className="mt-6 max-w-87.5">
        <Label
          htmlFor="checkout-note"
          className="mb-3 text-[15px] leading-4 font-normal"
        >
          Observação do colecionador (opcional)
        </Label>
        <Textarea
          id="checkout-note"
          rows={6}
          maxLength={1000}
          disabled={disabled}
          className="min-h-38 rounded-[3px] border-border bg-transparent dark:bg-transparent"
          aria-describedby={errors.note ? "checkout-note-error" : undefined}
          {...register("note")}
        />
        <FieldError id="checkout-note-error" message={errors.note?.message} />
      </div>
    </section>
  );
};

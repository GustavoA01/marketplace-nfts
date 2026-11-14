import type { FormEventHandler } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EnsNameField } from "@/components/EnsNameField";
import { FormField } from "@/components/FormField";
import type { ProfileFormValues } from "@/data/schemas/profile";
import { PasswordField } from "@/components/PasswordField";
import { AvatarField } from "./AvatarField";

type ProfileFormProps = {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  watch: UseFormWatch<ProfileFormValues>;
  isSubmitting: boolean;
  hasAvatar: boolean;
  avatarAlt: string;
  avatarUrl?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onEnsSuffixChange: (value: ".eth" | ".xyz") => void;
  onAvatarChange: (file: File) => void;
  onAvatarRemove: () => void;
};

export const ProfileForm = ({
  register,
  errors,
  watch,
  isSubmitting,
  hasAvatar,
  avatarAlt,
  avatarUrl,
  onSubmit,
  onEnsSuffixChange,
  onAvatarChange,
  onAvatarRemove,
}: ProfileFormProps) => {
  const ensNameRegister = register("ensName");

  return (
    <form
      className="flex w-full flex-col gap-6 font-mono sm:gap-8"
      onSubmit={onSubmit}
      noValidate
    >
      <h1 className="hidden text-base leading-4 font-bold text-foreground lg:block">
        Perfil do colecionador
      </h1>

      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-x-7">
          <FormField
            label="Nome de exibição"
            htmlFor="displayName"
            required
            error={errors.displayName?.message}
          >
            <Input
              id="displayName"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.displayName)}
              className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs placeholder:text-secondary sm:h-10 sm:px-4 sm:text-sm"
              {...register("displayName")}
            />
          </FormField>

          <FormField
            label="Nome de usuário"
            htmlFor="username"
            required
            error={errors.username?.message}
          >
            <Input
              id="username"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.username)}
              className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs placeholder:text-secondary sm:h-10 sm:px-4 sm:text-sm"
              {...register("username")}
            />
          </FormField>

          <FormField
            label="E-mail"
            htmlFor="email"
            required
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.email)}
              className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs placeholder:text-secondary sm:h-10 sm:px-4 sm:text-sm"
              {...register("email")}
            />
          </FormField>

          <EnsNameField
            ensName={watch("ensName")}
            ensSuffix={watch("ensSuffix")}
            ensNameError={errors.ensName?.message}
            ensSuffixError={errors.ensSuffix?.message}
            disabled={isSubmitting}
            onEnsNameChange={ensNameRegister.onChange}
            onEnsSuffixChange={onEnsSuffixChange}
            ensNameName={ensNameRegister.name}
            ensNameRef={ensNameRegister.ref}
          />

          <FormField
            label="Apelido da carteira"
            htmlFor="walletAlias"
            required
            error={errors.walletAlias?.message}
          >
            <Input
              id="walletAlias"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.walletAlias)}
              className="h-9 rounded-[3px] border-border bg-transparent px-3 font-mono text-xs placeholder:text-secondary sm:h-10 sm:px-4 sm:text-sm"
              {...register("walletAlias")}
            />
          </FormField>

          <AvatarField
            hasAvatar={hasAvatar}
            alt={avatarAlt}
            avatarUrl={avatarUrl}
            disabled={isSubmitting}
            onFileSelect={onAvatarChange}
            onRemoveClick={onAvatarRemove}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        <h2 className="text-sm leading-4 font-medium text-foreground sm:text-base">
          Alterar senha
        </h2>

        <FormField
          label="Senha atual"
          htmlFor="currentPassword"
          error={errors.currentPassword?.message}
          className="max-w-104.25 gap-2 sm:gap-3"
        >
          <PasswordField
            id="currentPassword"
            autoComplete="current-password"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.currentPassword)}
            className="h-9 rounded-[3px] px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
            {...register("currentPassword")}
          />
        </FormField>

        <FormField
          label="Nova senha"
          htmlFor="newPassword"
          error={errors.newPassword?.message}
          className="max-w-104.25 gap-2 sm:gap-3"
        >
          <PasswordField
            id="newPassword"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.newPassword)}
            className="h-9 rounded-[3px] px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
            {...register("newPassword")}
          />
        </FormField>

        <FormField
          label="Confirmar nova senha"
          htmlFor="confirmNewPassword"
          error={errors.confirmNewPassword?.message}
          className="max-w-104.25 gap-2 sm:gap-3"
        >
          <PasswordField
            id="confirmNewPassword"
            autoComplete="new-password"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.confirmNewPassword)}
            className="h-9 rounded-[3px] px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
            {...register("confirmNewPassword")}
          />
        </FormField>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-9 w-28 rounded-[3px] font-mono text-xs font-bold text-ink sm:h-10 sm:w-32.75 sm:text-sm"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
};

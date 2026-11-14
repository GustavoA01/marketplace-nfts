import { requireSession } from "@/features/Auth/utils/navigation";
import { createFileRoute } from "@tanstack/react-router";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { ProfileForm } from "./-components/ProfileForm";
import { useProfileForm } from "./-hooks/useProfileForm";

const Page = () => {
  const {
    isPending,
    isError,
    isSubmitting,
    hasAvatar,
    avatarUrl,
    avatarAlt,
    register,
    errors,
    watch,
    onSubmit,
    onEnsSuffixChange,
    onAvatarChange,
    onAvatarRemove,
  } = useProfileForm();

  return (
    <>
      <AccountMobileBar title="Meu perfil" />
      <div className="flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-start">
        <AccountSidebar active="profile" />
        <div className="min-w-0 flex-1">
          {isPending ? (
            <p className="font-mono text-sm text-text-secondary">
              Carregando perfil...
            </p>
          ) : isError ? (
            <p className="font-mono text-sm text-destructive">
              Não foi possível carregar o perfil.
            </p>
          ) : (
            <ProfileForm
              register={register}
              errors={errors}
              watch={watch}
              isSubmitting={isSubmitting}
              hasAvatar={hasAvatar}
              avatarAlt={avatarAlt}
              avatarUrl={avatarUrl}
              onSubmit={onSubmit}
              onEnsSuffixChange={onEnsSuffixChange}
              onAvatarChange={onAvatarChange}
              onAvatarRemove={onAvatarRemove}
            />
          )}
        </div>
      </div>
      <MobileBottomNavigation />
    </>
  );
};

export const Route = createFileRoute("/perfil/")({
  beforeLoad: requireSession,
  component: Page,
});

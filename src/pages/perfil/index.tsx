import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AccountMobileBar } from "@/components/AccountMobileBar";
import { AccountSidebar } from "@/components/AccountSidebar";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { profileSchema, type ProfileFormValues } from "@/data/schemas/profile";
import type { FormStatus } from "@/data/types/form-status";
import { ProfileForm } from "./-components/ProfileForm";
import {
  collectorAvatarMock,
  collectorProfileMock,
} from "@/mocks/temporary/collector-profile";

const Page = () => {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [hasAvatar, setHasAvatar] = useState(collectorAvatarMock.hasAvatar);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: collectorProfileMock,
  });

  const onSubmit = handleSubmit((data) => {
    setStatus("submitting");
    console.log({ ...data, hasAvatar, avatarUrl });
    window.setTimeout(() => {
      setStatus("idle");
    }, 600);
  });

  return (
    <>
      <AccountMobileBar title="Meu perfil" />
      <div className="flex flex-col gap-5 sm:gap-7 lg:flex-row lg:items-start">
        <AccountSidebar active="profile" />
        <div className="min-w-0 flex-1">
          <ProfileForm
            register={register}
            errors={errors}
            watch={watch}
            status={status}
            hasAvatar={hasAvatar}
            avatarAlt={collectorAvatarMock.alt}
            avatarUrl={avatarUrl}
            onSubmit={onSubmit}
            onEnsSuffixChange={(value) => {
              setValue("ensSuffix", value, { shouldValidate: true });
            }}
            onAvatarChange={() => {
              console.log("Upload de avatar fora do escopo desta etapa");
              setHasAvatar(true);
              setAvatarUrl("/mocks/GlassesMonkey.png");
            }}
            onAvatarRemove={() => {
              console.log("Remoção de avatar fora do escopo desta etapa");
              setHasAvatar(false);
              setAvatarUrl(undefined);
            }}
          />
        </div>
      </div>
      <MobileBottomNavigation />
    </>
  );
};

export const Route = createFileRoute("/perfil/")({ component: Page });

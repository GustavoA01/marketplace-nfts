import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { queryKeys } from "@/data/query-keys";
import { profileSchema, type ProfileFormValues } from "@/data/schemas/profile";
import type { AuthUser } from "@/data/types/auth";
import type { CollectorProfile, ProfileApiError } from "@/data/types/profile";
import { queryClient } from "@/lib/query-client";
import { getProfile } from "@/services/profile/get";
import { updateProfile } from "@/services/profile/update";

const emptyProfileValues: ProfileFormValues = {
  displayName: "",
  username: "",
  email: "",
  ensSuffix: ".eth",
  ensName: "",
  walletAlias: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const toFormValues = (profile: CollectorProfile): ProfileFormValues => ({
  displayName: profile.displayName,
  username: profile.username,
  email: profile.email,
  ensSuffix: profile.ensSuffix,
  ensName: profile.ensName,
  walletAlias: profile.walletAlias,
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

export const useProfileForm = () => {
  const [hasAvatar, setHasAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const {
    data: profile,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.profile.current,
    queryFn: ({ signal }) => getProfile(signal),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyProfileValues,
  });

  useEffect(() => {
    if (!profile) return;
    reset(toFormValues(profile));
    setHasAvatar(Boolean(profile.avatarUrl));
    setAvatarUrl(profile.avatarUrl ?? undefined);
  }, [profile, reset]);

  const syncProfile = (nextProfile: CollectorProfile) => {
    queryClient.setQueryData(queryKeys.profile.current, nextProfile);
    queryClient.setQueryData(
      queryKeys.auth.session,
      (current: AuthUser | null | undefined) =>
        current
          ? {
              ...current,
              username: nextProfile.username,
              email: nextProfile.email,
              displayName: nextProfile.displayName,
              avatarUrl: nextProfile.avatarUrl,
            }
          : current,
    );
    reset(toFormValues(nextProfile));
    setHasAvatar(Boolean(nextProfile.avatarUrl));
    setAvatarUrl(nextProfile.avatarUrl ?? undefined);
  };

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationKey: queryKeys.profile.update,
    mutationFn: updateProfile,
    retry: false,
    onSuccess: syncProfile,
    onError: (error) => {
      if (profile) {
        setHasAvatar(Boolean(profile.avatarUrl));
        setAvatarUrl(profile.avatarUrl ?? undefined);
      }

      if (!isAxiosError<ProfileApiError>(error)) {
        toast.error("Não foi possível salvar o perfil. Tente novamente.");
        return;
      }

      const { message, errors: fieldErrors } = error.response?.data ?? {};
      if (fieldErrors) {
        for (const field of Object.keys(
          fieldErrors,
        ) as (keyof ProfileFormValues)[]) {
          const fieldMessage = fieldErrors[field];
          if (fieldMessage)
            setError(field, { type: "server", message: fieldMessage });
        }
      }

      toast.error(
        message ?? "Não foi possível salvar o perfil. Tente novamente.",
      );
    },
  });

  const saveProfile = (
    nextAvatarUrl: string | null,
    successMessage: string,
  ) => {
    const values = getValues();
    mutate(
      {
        ...values,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        avatarUrl: nextAvatarUrl,
      },
      { onSuccess: () => toast.success(successMessage) },
    );
  };

  return {
    isPending,
    isError,
    isSubmitting,
    hasAvatar,
    avatarUrl,
    avatarAlt: "Avatar do perfil",
    register,
    errors,
    watch,
    onSubmit: handleSubmit((data) => {
      mutate(
        {
          ...data,
          avatarUrl: hasAvatar ? (avatarUrl ?? null) : null,
        },
        { onSuccess: () => toast.success("Perfil atualizado.") },
      );
    }),
    onEnsSuffixChange: (value: ".eth" | ".xyz") => {
      setValue("ensSuffix", value, { shouldValidate: true });
    },
    onAvatarChange: (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          toast.error("Não foi possível ler a imagem selecionada.");
          return;
        }
        setHasAvatar(true);
        setAvatarUrl(result);
        saveProfile(result, "Avatar atualizado.");
      };
      reader.onerror = () => {
        toast.error("Não foi possível ler a imagem selecionada.");
      };
      reader.readAsDataURL(file);
    },
    onAvatarRemove: () => {
      setHasAvatar(false);
      setAvatarUrl(undefined);
      saveProfile(null, "Avatar removido.");
    },
  };
};

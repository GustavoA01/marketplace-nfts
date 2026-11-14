import type { ProfileFormValues } from "@/data/schemas/profile";

export const collectorProfileMock: ProfileFormValues = {
  displayName: "Luna Colecionadora",
  username: "lunacurator",
  email: "luna.colecionadora@email.com",
  ensSuffix: ".eth",
  ensName: "luna",
  walletAlias: "Carteira principal",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const collectorAvatarMock = {
  hasAvatar: false,
  alt: "Avatar do perfil",
};

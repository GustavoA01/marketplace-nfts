import { z } from "zod";

export const profileSchema = z
  .object({
    displayName: z.string().min(2, "Informe o nome de exibição"),
    username: z
      .string()
      .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
      .max(32, "O nome de usuário deve ter no máximo 32 caracteres"),
    email: z.email("Informe um e-mail válido"),
    ensSuffix: z.enum([".eth", ".xyz"]),
    ensName: z.string().trim(),
    walletAlias: z.string().trim(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const changingPassword = Boolean(
      data.currentPassword || data.newPassword || data.confirmNewPassword,
    );

    if (!changingPassword) return;

    if (!data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Informe a senha atual",
        path: ["currentPassword"],
      });
    }

    if (!data.newPassword || data.newPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "A nova senha deve ter pelo menos 8 caracteres",
        path: ["newPassword"],
      });
    }

    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem",
        path: ["confirmNewPassword"],
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;

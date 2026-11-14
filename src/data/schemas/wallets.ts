import { z } from "zod";

export const walletSchema = z.object({
  displayName: z.string().min(2, "Informe o nome de exibição"),
  alias: z.string().min(1, "Informe o apelido da carteira"),
  network: z.string().min(1, "Selecione uma rede"),
  profileName: z.string().min(1, "Informe o nome do perfil"),
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Informe um endereço 0x válido"),
  secondaryAddress: z.string().optional(),
  walletType: z.string().min(1, "Selecione um tipo de carteira"),
  referralCode: z.string().min(1, "Informe o código de indicação"),
  email: z.email("Informe um e-mail válido"),
  ensSuffix: z.enum([".eth", ".xyz"]),
  ensName: z.string().min(1, "Informe o nome ENS"),
});

export type WalletFormValues = z.infer<typeof walletSchema>;

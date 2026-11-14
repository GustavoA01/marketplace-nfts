import { z } from "zod";

export const walletNetworks = ["ethereum", "polygon", "solana"] as const;
export const walletTypes = ["metamask", "walletconnect", "coinbase"] as const;

export type WalletNetwork = (typeof walletNetworks)[number];
export type WalletTypeOption = (typeof walletTypes)[number];

export const networkOptions = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "solana", label: "Solana" },
] as const;

export const walletTypeOptions = [
  { value: "metamask", label: "MetaMask" },
  { value: "walletconnect", label: "WalletConnect" },
  { value: "coinbase", label: "Coinbase Wallet" },
] as const;

const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const isValidAddressForNetwork = (address: string, network: string) => {
  if (network === "solana") return solanaAddressRegex.test(address);
  if (network === "ethereum" || network === "polygon")
    return ethereumAddressRegex.test(address);
  return false;
};

export const walletSchema = z
  .object({
    displayName: z.string().min(2, "Informe o nome de exibição"),
    alias: z.string().min(1, "Informe o apelido da carteira"),
    network: z
      .string()
      .min(1, "Selecione uma rede")
      .refine(
        (value) => (walletNetworks as readonly string[]).includes(value),
        {
          message: "Selecione uma rede",
        },
      ),
    profileName: z.string().min(1, "Informe o nome do perfil"),
    address: z.string().min(1, "Informe o endereço da carteira"),
    secondaryAddress: z.string().optional(),
    walletType: z
      .string()
      .min(1, "Selecione um tipo de carteira")
      .refine((value) => (walletTypes as readonly string[]).includes(value), {
        message: "Selecione um tipo de carteira",
      }),
    referralCode: z.string().optional(),
    email: z.email("Informe um e-mail válido"),
    ensSuffix: z.enum([".eth", ".xyz"]),
    ensName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isValidAddressForNetwork(data.address, data.network)) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message:
          data.network === "solana"
            ? "Informe um endereço Solana válido"
            : "Informe um endereço 0x válido",
      });
    }
  });

export const createWalletSchema = walletSchema.and(
  z.object({
    kind: z.enum(["main", "secondary"], {
      error: "Informe o tipo da carteira",
    }),
  }),
);

export type WalletFormValues = z.infer<typeof walletSchema>;

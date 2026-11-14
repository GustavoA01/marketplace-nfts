import { z } from "zod";

export const addCartItemSchema = z.strictObject({
  nftId: z.string().trim().min(1, "Informe o NFT.").max(100),
  edition: z.string().trim().min(1, "Selecione uma edição.").max(40),
  quantity: z
    .number()
    .int("Informe uma quantidade inteira.")
    .min(1, "A quantidade mínima é 1.")
    .max(10_000),
});

export const updateCartItemSchema = addCartItemSchema.pick({ quantity: true });

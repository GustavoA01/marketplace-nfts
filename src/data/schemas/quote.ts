import { z } from "zod";

export const couponSchema = z.strictObject({
  code: z
    .string()
    .trim()
    .min(1, "Informe o cupom.")
    .max(32)
    .transform((value) => value.toUpperCase()),
});
export const quoteSchema = z.strictObject({
  cartSignature: z.string().min(1).max(100_000),
  network: z.enum(["ethereum", "polygon", "solana"]).optional(),
});

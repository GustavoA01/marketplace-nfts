import { z } from "zod";
export const collectorSchema = z.object({
  displayName: z.string().trim().min(2, "Informe o nome de exibição."),
  username: z.string().trim().min(1, "Informe o usuário."),
  profileName: z.string().trim().min(1, "Informe o nome do perfil."),
  email: z.email("Informe um e-mail válido."),
  note: z.string().trim().max(1000),
});
export const createOrderSchema = z.strictObject({
  quoteId: z.uuid(),
  connectionId: z.uuid(),
  collector: collectorSchema,
});
export type CollectorValues = z.infer<typeof collectorSchema>;
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
const summary = z.object({
  subtotal: z.string(),
  discount: z.string(),
  networkFee: z.string(),
  total: z.string(),
});
const item = z.object({
  id: z.string(),
  nftId: z.string(),
  name: z.string(),
  token: z.string(),
  edition: z.string(),
  image: z.string(),
  quantity: z.number().int().positive(),
  price: z.string(),
  total: z.string(),
});
export const connectionSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  walletId: z.string(),
  network: z.string(),
  address: z.string(),
  expiresAt: z.number(),
  connected: z.boolean(),
});
export const orderSchema = z.object({
  id: z.uuid(),
  attemptKey: z.uuid(),
  status: z.enum(["pending", "confirmed", "declined"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  transaction: z.string().nullable(),
  reason: z.string().optional(),
  items: z.array(item),
  summary,
  collector: collectorSchema,
  wallet: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    network: z.string(),
  }),
});
export type Order = z.infer<typeof orderSchema>;
export type WalletConnection = z.infer<typeof connectionSchema>;
export const storedOrderSchema = orderSchema.extend({
  userId: z.string(),
  fingerprint: z.string(),
  settlesAt: z.number(),
  outcome: z.enum(["confirmed", "declined"]),
});
export type StoredOrder = z.infer<typeof storedOrderSchema>;

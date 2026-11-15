import { z } from "zod";
import { createOrderSchema } from "@/data/schemas/orders";
const schema = z.object({ key: z.uuid(), payload: createOrderSchema });
export type OrderAttempt = z.infer<typeof schema>;
const key = (userId: string) => `marketplace-nfts:order-attempt:${userId}`;
export const getOrderAttempt = (userId?: string): OrderAttempt | undefined => {
  if (!userId) return undefined;
  try {
    const result = schema.safeParse(
      JSON.parse(sessionStorage.getItem(key(userId)) ?? "null"),
    );
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
};
export const saveOrderAttempt = (userId: string, attempt: OrderAttempt) =>
  sessionStorage.setItem(key(userId), JSON.stringify(attempt));
export const clearOrderAttempt = (userId: string) =>
  sessionStorage.removeItem(key(userId));

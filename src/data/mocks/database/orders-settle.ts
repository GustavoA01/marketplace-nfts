import { changeNFT } from "../realtime/market";
import { publishOrderUpdate } from "../realtime/orders";
import { readOrders, saveOrders, publicOrder } from "./orders-store";
import { readCartStore, saveCartStore, storedCartItems } from "./cart-storage";
import { nfts } from "../fixtures/nfts";
import { getEditionStock, getNFTStock } from "./inventory";
import type { StoredOrder } from "@/data/schemas/orders";

const available = (order: StoredOrder) =>
  order.items.every((item) => {
    const nft = nfts.find((entry) => entry.id === item.nftId);
    const total = order.items
      .filter((entry) => entry.nftId === item.nftId)
      .reduce((sum, entry) => sum + entry.quantity, 0);
    return (
      nft &&
      getEditionStock(nft, item.edition) >= item.quantity &&
      getNFTStock(nft) >= total
    );
  });

export const consultOrder = (userId: string, id?: string, attempt?: string) => {
  const store = readOrders();
  const order = store.orders.find(
    (entry) =>
      entry.userId === userId &&
      (id ? entry.id === id : entry.attemptKey === attempt),
  );

  if (!order) return undefined;
  if (order.status !== "pending" || Date.now() < order.settlesAt)
    return publicOrder(order);

  const carts = readCartStore();
  const applied = carts.completedOrders.includes(order.id);

  if (!applied && (order.outcome === "declined" || !available(order))) {
    order.status = "declined";
    order.reason =
      order.outcome === "declined"
        ? "Pagamento recusado. Revise os dados ou utilize outra carteira."
        : "O estoque mudou durante o pagamento. Revise os itens.";
  } else {
    if (!applied) {
      const items = storedCartItems(carts, userId);
      carts.users[userId] = items.flatMap((item) => {
        const purchased =
          order.items.find(
            (entry) =>
              entry.id === item.id &&
              entry.nftId === item.nftId &&
              entry.edition === item.edition,
          )?.quantity ?? 0;
        return item.quantity > purchased
          ? [{ ...item, quantity: item.quantity - purchased }]
          : [];
      });
      for (const item of order.items) {
        carts.stockAdjustments[item.nftId] =
          (carts.stockAdjustments[item.nftId] ?? 0) + item.quantity;
        const editionKey = JSON.stringify([item.nftId, item.edition]);
        carts.editionAdjustments[editionKey] =
          (carts.editionAdjustments[editionKey] ?? 0) + item.quantity;
      }
      carts.completedOrders.push(order.id);
      saveCartStore(carts);
    }
    order.status = "confirmed";
    order.transaction = `0x${order.id.replaceAll("-", "")}${order.id.replaceAll("-", "")}`;
  }
  order.version += 1;
  order.updatedAt = new Date().toISOString();
  saveOrders(store);
  publishOrderUpdate(order);

  if (order.status === "confirmed")
    for (const nftId of Array.from(
      new Set(order.items.map((item) => item.nftId)),
    ))
      changeNFT(nftId, {}, "purchase");

  return publicOrder(order);
};

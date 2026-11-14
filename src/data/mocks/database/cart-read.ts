import type { CartItem } from "@/data/types/cart";
import { summarizeCart } from "@/lib/cart";
import { ethToWei, weiToEth } from "@/lib/eth";
import { nfts } from "../fixtures/nfts";
import type { StoredCartItem } from "./cart-storage";
import { getEditionStock } from "./inventory";

export const buildCart = (
  stored: StoredCartItem[],
  couponCode: string | null = null,
) => {
  const items: CartItem[] = stored.map((item) => {
    const nft = nfts.find((entry) => entry.id === item.nftId);
    if (!nft) throw new Error("NFT do carrinho não encontrado.");
    const otherQuantity = stored
      .filter((entry) => entry.nftId === nft.id && entry.id !== item.id)
      .reduce((total, entry) => total + entry.quantity, 0);
    const maxQuantity = Math.max(
      0,
      Math.min(
        getEditionStock(nft, item.edition),
        nft.availableQuantity - otherQuantity,
      ),
    );
    return {
      ...item,
      name: nft.name,
      image: nft.image,
      imageDescription: nft.imageDescription,
      network: nft.network,
      unitPrice: nft.price,
      lineTotal: weiToEth(ethToWei(nft.price) * BigInt(item.quantity)),
      availableQuantity: nft.availableQuantity,
      maxQuantity,
      isAvailable: item.quantity <= maxQuantity,
    };
  });
  return summarizeCart(items, couponCode);
};

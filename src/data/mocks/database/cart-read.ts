import type { CartItem } from "@/data/types/cart";
import { getNFTPrice, getNFTVersion } from "./market-store";
import { summarizeCart } from "@/lib/cart";
import { ethToWei, weiToEth } from "@/lib/eth";
import { nfts } from "../fixtures/nfts";
import type { StoredCartItem } from "./cart-storage";
import { getEditionStock, getNFTStock } from "./inventory";

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
        getNFTStock(nft) - otherQuantity,
      ),
    );
    return {
      ...item,
      name: nft.name,
      image: nft.image,
      imageDescription: nft.imageDescription,
      network: nft.network,
      unitPrice: getNFTPrice(nft),
      version: getNFTVersion(nft.id),
      lineTotal: weiToEth(ethToWei(getNFTPrice(nft)) * BigInt(item.quantity)),
      availableQuantity: getNFTStock(nft),
      maxQuantity,
      isAvailable: item.quantity <= maxQuantity,
    };
  });
  return summarizeCart(items, couponCode);
};

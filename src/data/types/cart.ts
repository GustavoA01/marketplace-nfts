export type AddCartItemPayload = {
  nftId: string;
  edition: string;
  quantity: number;
};

export type CartItem = AddCartItemPayload & {
  id: string;
  name: string;
  image: string;
  imageDescription: string;
  network: string;
  unitPrice: string;
  lineTotal: string;
  availableQuantity: number;
  maxQuantity: number;
  isAvailable: boolean;
};

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: string;
  currency: "ETH";
  couponCode: string | null;
};

export type CartResponse = { cart: Cart };

export type CartApiError = {
  code:
    | "COUPON_INVALID"
    | "COUPON_EXPIRED"
    | "CART_CHANGED"
    | "NETWORK_MISMATCH"
    | "EMPTY_CART"
    | "ITEM_NOT_FOUND"
    | "SESSION_EXPIRED"
    | "INVALID_REQUEST"
    | "VALIDATION_ERROR"
    | "NFT_NOT_FOUND"
    | "EDITION_UNAVAILABLE"
    | "INSUFFICIENT_STOCK"
    | "STORAGE_UNAVAILABLE";
  message: string;
  errors?: Partial<Record<keyof AddCartItemPayload | "couponCode", string>>;
};

export type UpdateCartItemPayload = { quantity: number };

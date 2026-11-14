export type PurchaseItem = {
  id: string;
  name: string;
  token: string;
  edition: string;
  image: string;
  quantity: number;
  price: string;
  total: string;
};

export type PriceSummary = {
  subtotal: string;
  discount: string;
  networkFee: string;
  total: string;
};

export type CollectorWalletPreview = {
  id: string;
  name: string;
  address: string;
  network: string;
  selected?: boolean;
};

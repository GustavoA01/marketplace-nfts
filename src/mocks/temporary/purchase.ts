import type {
  CollectorWalletPreview,
  PriceSummary,
  PurchaseItem,
} from "@/data/types/purchase";

export const cartItemsMock: PurchaseItem[] = [
  {
    id: "emerald-ape-042",
    name: "Emerald Ape #042",
    token: "#0042",
    edition: "1/50",
    image: "/mocks/CartEmerald.png",
    quantity: 2,
    price: "1.19",
    total: "2.38",
  },
  {
    id: "violet-nomad-314",
    name: "Violet Nomad #314",
    token: "#0314",
    edition: "1/1",
    image: "/mocks/CartViolet.png",
    quantity: 6,
    price: "1.39",
    total: "8.34",
  },
  {
    id: "ivory-baron-088",
    name: "Ivory Baron #088",
    token: "#0088",
    edition: "1/10",
    image: "/mocks/CartIvory.png",
    quantity: 9,
    price: "1.79",
    total: "16.11",
  },
];

export const mobileCartItemsMock: PurchaseItem[] = [
  {
    ...cartItemsMock[0],
    image: "/mocks/MobileCartEmerald.png",
    quantity: 1,
    total: "1.19",
  },
  {
    ...cartItemsMock[1],
    image: "/mocks/MobileCartViolet.png",
    quantity: 1,
    total: "1.39",
  },
  {
    ...cartItemsMock[2],
    image: "/mocks/MobileCartIvory.png",
    quantity: 2,
    total: "3.58",
  },
  {
    id: "golden-beat-207",
    name: "Golden Beat #207",
    token: "#0207",
    edition: "1/50",
    image: "/mocks/MobileCartGolden.png",
    quantity: 2,
    price: "0.99",
    total: "1.98",
  },
];

export const cartSummaryMock: PriceSummary = {
  subtotal: "26.83",
  discount: "0.00",
  networkFee: "0.016",
  total: "26.846",
};
export const mobileCartSummaryMock: PriceSummary = {
  subtotal: "8.14",
  discount: "0.00",
  networkFee: "0.016",
  total: "8.156",
};

export const collectorWalletsMock: CollectorWalletPreview[] = [
  {
    id: "reserve",
    name: "Reserva",
    address: "nova.kurio.eth",
    network: "Rede Polygon",
    selected: true,
  },
  {
    id: "primary",
    name: "Principal",
    address: "0xA91F…E82C",
    network: "Rede principal Ethereum",
  },
];

export const checkoutItemsMock = cartItemsMock.map((item, index) => ({
  ...item,
  image: [
    "/mocks/CheckoutEmerald.png",
    "/mocks/CheckoutViolet.png",
    "/mocks/CheckoutIvory.png",
  ][index],
}));
export const receiptItemsMock = cartItemsMock.map((item, index) => ({
  ...item,
  image: [
    "/mocks/ReceiptEmerald.png",
    "/mocks/ReceiptViolet.png",
    "/mocks/ReceiptIvory.png",
  ][index],
}));
export const receiptMock = {
  transaction: "0xA91F…E82C",
  date: "29 Jul, 2026",
  wallet: "MetaMask",
  network: "Ethereum",
};

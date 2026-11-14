import type { NFTDetail } from "@/data/types/catalogue";

export const nftDetailFixtures: Record<
  string,
  Partial<
    Pick<
      NFTDetail,
      | "gallery"
      | "token"
      | "attributes"
      | "rating"
      | "reviews"
      | "paragraphs"
      | "metadata"
      | "defaultEdition"
    >
  >
> = {
  "emerald-ape-042": {
    defaultEdition: "1/50",
    gallery: [
      {
        image: "/mocks/DetailEmerald.png",
        mobileImage: "/mocks/MobileDetailEmerald.png",
        description: "Emerald Ape com óculos e jaqueta verde",
      },
      {
        image: "/mocks/EmeraldApe.png",
        mobileImage: "/mocks/EmeraldApe.png",
        description: "Retrato de Emerald Ape",
      },
      {
        image: "/mocks/CheckoutEmerald.png",
        mobileImage: "/mocks/CheckoutEmerald.png",
        description: "Emerald Ape, detalhe da ilustração",
      },
      {
        image: "/mocks/ReceiptEmerald.png",
        mobileImage: "/mocks/ReceiptEmerald.png",
        description: "Emerald Ape, versão de coleção",
      },
    ],
    token: "#0042",
    attributes: "Óculos, Esmeralda, Raro",
    rating: "4.8",
    reviews: 19,
    paragraphs: [
      "Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.",
      "A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.",
    ],
    metadata: [
      {
        label: "Rede",
        value:
          "Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.",
      },
      {
        label: "Contrato",
        value: "0x7A42...19E8 • Contrato inteligente ERC-721 verificado.",
      },
      {
        label: "Direitos autorais",
        value:
          "Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.",
      },
    ],
  },
};

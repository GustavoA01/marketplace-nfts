export const nftDetailsMock = {
  title: "Emerald Ape #042",
  price: "1.19",
  image: "/mocks/DetailEmerald.png",
  mobileImage: "/mocks/MobileDetailEmerald.png",
  token: "#0042",
  collection: "Kurio Apes",
  attributes: "Óculos, Esmeralda, Raro",
  rating: "4.8",
  reviews: 19,
  editions: ["1/1", "1/10", "1/50", "ABERTA"],
  selectedEdition: "1/50",
  description:
    "Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.",
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
};

export type NFTDetailsPreview = typeof nftDetailsMock;

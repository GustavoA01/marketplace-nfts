export const couponFixtures = [
  { code: "KURIO10", percentage: 10, expiresAt: null },
  { code: "EXPIRADO", percentage: 10, expiresAt: "2020-01-01T00:00:00.000Z" },
] as const;

export const networkFeeFixtures = {
  ethereum: "0.003",
  polygon: "0.0001",
  solana: "0.00005",
} as const;

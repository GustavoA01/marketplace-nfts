const decimals = BigInt(10) ** BigInt(18);

export const ethToWei = (value: string): bigint => {
  if (!/^\d+(?:\.\d{1,18})?$/.test(value))
    throw new Error("Valor em ETH inválido.");
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * decimals + BigInt(fraction.padEnd(18, "0"));
};

export const weiToEth = (value: bigint): string => {
  const fraction = (value % decimals)
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "")
    .padEnd(2, "0");
  return `${value / decimals}.${fraction}`;
};

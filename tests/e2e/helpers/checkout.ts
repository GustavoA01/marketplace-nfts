import type { Page } from "@playwright/test";

export const seedCheckout = async (
  page: Page,
  network: "ethereum" | "polygon" = "ethereum",
) =>
  page.evaluate(async (network) => {
    const load = (url: string) => import(url);
    const [{ getWallets }, { createWallet }, { addCartItem }] =
      await Promise.all([
        load("/src/services/wallets/list.ts"),
        load("/src/services/wallets/create.ts"),
        load("/src/services/cart/add.ts"),
      ]);
    const [main] = await getWallets();
    const { id, ...values } = main;
    void id;
    const secondary = await createWallet({
      ...values,
      kind: "secondary",
      network,
      alias: "Carteira secundária de teste",
      walletType: "coinbase",
      address: "0x2222222222222222222222222222222222222222",
      ensName: "",
      secondaryAddress: "",
    });
    await addCartItem({
      nftId: "emerald-ape-042",
      edition: "1/50",
      quantity: 1,
    });
    return secondary.id;
  }, network);

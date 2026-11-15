import { expect, test } from "@playwright/test";
import {
  captureEvents,
  controlRealtime,
  preparePayment,
} from "./helpers/realtime";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`Preço em tempo real ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("atualiza a cotação, exige revisão e descarta duplicatas e eventos antigos", async ({
      page,
    }) => {
      test.setTimeout(60_000);
      const { review, confirm } = await preparePayment(
        page,
        "price-change",
        viewport.name === "mobile",
      );
      const events = await captureEvents(page);
      const original = await page.evaluate(async () => {
        const load = (url: string) => import(url);
        const [
          { getCart },
          { createQuote },
          { cartSignature },
          { connectWallet },
        ] = await Promise.all([
          load("/src/services/cart/get.ts"),
          load("/src/services/quotes/create.ts"),
          load("/src/lib/cart.ts"),
          load("/src/services/orders/index.ts"),
        ]);
        const cart = await getCart();
        const quote = await createQuote({
          cartSignature: cartSignature(cart),
          network: "ethereum",
        });
        const connection = await connectWallet("wallet-luna-main");

        return { quoteId: quote.id, connectionId: connection.id };
      });

      await controlRealtime(page, { action: "run-scenario" });

      await expect(
        page.getByText(
          "O preço ou a disponibilidade de um NFT mudou. Revise os valores antes de confirmar.",
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        page.getByText("1.49 ETH", { exact: true }).first(),
      ).toBeVisible();
      await expect(review).not.toBeChecked();
      await expect(confirm).toBeDisabled();

      const rejected = await page.evaluate(async (original) => {
        const url = "/src/services/orders/index.ts";
        const { submitOrder } = await import(url);

        try {
          await submitOrder(crypto.randomUUID(), {
            ...original,
            collector: {
              displayName: "Luna",
              username: "luna",
              profileName: "luna",
              email: "luna@example.com",
              note: "",
            },
          });

          return undefined;
        } catch (error) {
          return (error as { response?: { status: number } }).response?.status;
        }
      }, original);

      expect(rejected).toBe(409);

      await controlRealtime(page, {
        action: "replay-nft",
        nftId: "emerald-ape-042",
      });
      await controlRealtime(page, {
        action: "replay-nft",
        nftId: "emerald-ape-042",
        outdated: true,
      });

      await expect
        .poll(() => events.evaluate((events) => events.nfts.length))
        .toBe(3);
      await expect(
        page.getByText("0.01 ETH", { exact: true }),
      ).not.toBeVisible();
      await expect(
        page.getByText(
          "O preço ou a disponibilidade de um NFT mudou. Revise os valores antes de confirmar.",
          { exact: true },
        ),
      ).toHaveCount(1);

      await review.check();

      await expect(confirm).toBeEnabled();

      await confirm.click();

      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
      await expect(
        page.getByText("1.49 ETH", { exact: true }).first(),
      ).toBeVisible();
    });
  });
}

test("esgotamento por Socket.IO bloqueia pagamento e aparece no detalhe", async ({
  page,
}) => {
  const { confirm } = await preparePayment(page, "stock-change");

  await controlRealtime(page, { action: "run-scenario" });

  await expect(
    page.getByText("Ajuste os itens indisponíveis antes de continuar.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(confirm).toBeDisabled();

  await page.goto("/nfts/emerald-ape-042");

  await expect(page.getByText("NFT esgotado", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "COMPRAR", exact: true }),
  ).toBeDisabled();
});

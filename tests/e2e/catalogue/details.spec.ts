import { expect, test } from "@playwright/test";
import { openNFT, viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Detalhe ${viewport.name}`, () => {
    test.use({ viewport });

    test("acesso direto trata edição indisponível e limite de uma unidade", async ({
      page,
    }) => {
      await openNFT(page);

      await expect(page.getByRole("button", { name: /ABERTA/ })).toBeDisabled();
      await page.getByRole("button", { name: "1/1", exact: true }).click();

      await expect(
        page.getByRole("button", { name: "Aumentar quantidade", exact: true }),
      ).toBeDisabled();
      await expect(
        page.getByRole("button", { name: "Diminuir quantidade", exact: true }),
      ).toBeDisabled();

      await page
        .getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ })
        .click();

      await expect(page).toHaveURL(/\/carrinho/);
      await expect(
        page.getByText("Edição: 1/1", { exact: true }),
      ).toBeVisible();
    });

    test("NFT inexistente apresenta erro sem permitir compra", async ({
      page,
    }) => {
      await page.goto("/nfts/nft-inexistente");

      await expect(page.getByText(/NFT não encontrado/).first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ }),
      ).toHaveCount(0);
    });
  });
}

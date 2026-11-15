import { expect, test } from "@playwright/test";
import { loginAtNFT } from "../helpers/auth";
import { searchNFTs, waitForCatalogue } from "../helpers/catalogue";
import { readCart, viewports, visibleText } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Compra completa ${viewport.name}`, () => {
    test.use({ viewport });

    test("percorre catálogo, detalhe, carrinho e pagamento até recibo", async ({
      page,
    }) => {
      await loginAtNFT(page);
      await page.goto("/");
      await waitForCatalogue(page);

      await searchNFTs(page, "Emerald", viewport.name === "mobile");
      await page
        .locator("#catalogo")
        .getByRole("heading", { name: "Emerald Ape #042", exact: true })
        .click();
      await page.getByRole("button", { name: "1/50", exact: true }).click();
      await page
        .getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ })
        .click();

      await expect(page).toHaveURL(/\/carrinho/);

      await page.getByLabel("Código promocional").fill("KURIO10");
      await page.getByRole("button", { name: "Aplicar", exact: true }).click();

      await expect(visibleText(page, "1.074 ETH")).toBeVisible();

      await page
        .getByRole("button", { name: "Conectar e finalizar", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Conectar carteira", exact: true })
        .click();

      await expect(
        page.getByRole("button", { name: "Desconectar carteira", exact: true }),
      ).toBeVisible();

      if (viewport.name === "mobile")
        await page
          .getByRole("button", { name: "Dados do colecionador e revisão" })
          .click();

      await page
        .getByRole("checkbox", {
          name: "Revisei os itens, a carteira e o total desta compra.",
        })
        .check();
      await page
        .getByRole("button", { name: "Confirmar compra", exact: true })
        .click();

      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
      await expect(visibleText(page, "1.074 ETH")).toBeVisible();
      expect(new URL(page.url()).searchParams.get("attempt")).toBeTruthy();
      expect((await readCart(page)).items).toHaveLength(0);

      await page.reload();

      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
    });
  });
}

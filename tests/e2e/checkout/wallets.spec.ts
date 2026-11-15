import { expect, test } from "@playwright/test";
import { loginAtNFT } from "../helpers/auth";
import { seedCheckout } from "../helpers/checkout";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test.describe(`Carteiras no pagamento ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });
    test("troca carteira, exige nova conexão e revisão e conclui o pedido", async ({
      page,
    }) => {
      test.setTimeout(60_000);
      await loginAtNFT(page);
      const secondaryId = await seedCheckout(page);
      await page.goto("/pagamento");

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

      const review = page.getByRole("checkbox", {
        name: "Revisei os itens, a carteira e o total desta compra.",
      });
      const confirm = page.getByRole("button", {
        name: "Confirmar compra",
        exact: true,
      });

      await review.check();

      await expect(confirm).toBeEnabled();

      await page
        .getByRole("checkbox", { name: "Usar outra carteira?" })
        .check();
      await page
        .getByRole("radio", { name: /Carteira secundária de teste/ })
        .check();

      if (viewport.name === "mobile")
        await expect(
          page.locator(`#checkout-saved-${secondaryId}`),
        ).toBeChecked();

      await expect(review).not.toBeChecked();
      await expect(confirm).toBeDisabled();

      await page
        .getByRole("button", { name: "Conectar carteira", exact: true })
        .click();

      await expect(
        page.getByRole("button", { name: "Desconectar carteira", exact: true }),
      ).toBeVisible();

      await review.check();

      await expect(confirm).toBeEnabled();

      await confirm.click();

      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
      await expect(
        page.getByText("Carteira secundária de teste", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Ver no Etherscan", exact: true }),
      ).toHaveAttribute("href", /^https:\/\/etherscan\.io\/tx\/0x/);

      await page.goto("/carrinho");

      await expect(
        page.getByRole("heading", { name: "Seu carrinho está vazio" }),
      ).toBeVisible();
    });
  });
}

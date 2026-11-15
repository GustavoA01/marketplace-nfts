import { expect, test } from "@playwright/test";
import {
  addItem,
  openNFT,
  readCart,
  viewports,
  visibleText,
} from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Cupons ${viewport.name}`, () => {
    test.use({ viewport });

    test("aplica 10%, preserva no refresh e remove o desconto", async ({
      page,
    }) => {
      await openNFT(page);
      await addItem(page);
      await page.goto("/carrinho");

      await page.getByLabel("Código promocional").fill(" kurio10 ");
      await page.getByRole("button", { name: "Aplicar", exact: true }).click();

      await expect(page.getByText("Cupom aplicado:")).toContainText("KURIO10");
      await expect(visibleText(page, "1.074 ETH")).toBeVisible();

      await page.reload();

      await expect(page.getByText("Cupom aplicado:")).toContainText("KURIO10");
      expect((await readCart(page)).couponCode).toBe("KURIO10");

      await page
        .getByRole("button", { name: "Remover cupom", exact: true })
        .click();

      await expect(page.getByText("Cupom aplicado:")).toHaveCount(0);
      await expect(visibleText(page, "1.193 ETH")).toBeVisible();
    });

    for (const [code, message] of [
      ["TESTE123", "Cupom inválido."],
      ["EXPIRADO", "Este cupom expirou."],
    ]) {
      test(`rejeita ${code} e preserva os itens`, async ({ page }) => {
        await openNFT(page);
        await addItem(page);
        await page.goto("/carrinho");

        await page.getByLabel("Código promocional").fill(code);
        await page
          .getByRole("button", { name: "Aplicar", exact: true })
          .click();

        await expect(
          page.getByRole("alert").filter({ hasText: message }),
        ).toBeVisible();
        await expect(page.getByLabel("Código promocional")).toHaveAttribute(
          "aria-invalid",
          "true",
        );
        expect((await readCart(page)).items).toHaveLength(1);
        expect((await readCart(page)).couponCode).toBeNull();
      });
    }
  });
}

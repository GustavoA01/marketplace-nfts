import { expect, test } from "@playwright/test";
import { loginAtNFT } from "../helpers/auth";
import { addItem, viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Regressão visual ${viewport.name}`, () => {
    test.use({ viewport });

    for (const screen of [
      "inicio",
      "detalhe",
      "carrinho",
      "pagamento",
    ] as const) {
      test(`${screen} @visual`, async ({ page }) => {
        await page.clock.setFixedTime(new Date("2026-11-15T12:00:00.000Z"));

        if (screen === "carrinho" || screen === "pagamento") {
          await loginAtNFT(page);
          await addItem(page);
        }

        const paths = {
          inicio: "/",
          detalhe: "/nfts/emerald-ape-042",
          carrinho: "/carrinho",
          pagamento: "/pagamento",
        };
        await page.goto(paths[screen]);

        if (screen === "inicio")
          await expect(page.locator("#catalogo a h3").first()).toBeVisible();
        if (screen === "detalhe")
          await expect(
            page.getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ }),
          ).toBeVisible();
        if (screen === "carrinho")
          await expect(
            page.getByRole("button", {
              name: "Conectar e finalizar",
              exact: true,
            }),
          ).toBeEnabled({ timeout: 15_000 });
        if (screen === "pagamento")
          await expect(
            page.getByRole("button", {
              name: "Conectar carteira",
              exact: true,
            }),
          ).toBeVisible();

        await expect(page.locator("main .skeleton")).toHaveCount(0);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            Array.from(document.images, async (image) => {
              image.loading = "eager";
              await image.decode().catch(() => undefined);
            }),
          );
        });

        await expect(page).toHaveScreenshot(`${screen}-${viewport.name}.png`, {
          fullPage: true,
          animations: "disabled",
          caret: "hide",
          maxDiffPixelRatio: 0.002,
        });
      });
    }
  });
}

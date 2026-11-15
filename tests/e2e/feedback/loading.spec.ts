import { expect, test } from "@playwright/test";
import {
  addItem,
  openNFT,
  setScenario,
  startWithScenario,
  viewports,
} from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Carregamento ${viewport.name}`, () => {
    test.use({ viewport });

    test("catálogo lento mostra shimmer e respeita movimento reduzido", async ({
      page,
    }) => {
      await startWithScenario(page, "/", "catalogue", "slow");

      const skeleton = page.locator("#catalogo .skeleton").first();
      await expect(skeleton).toBeVisible();
      expect(
        await skeleton.evaluate(
          (element) => getComputedStyle(element, "::after").animationName,
        ),
      ).toContain("shimmer");

      await page.emulateMedia({ reducedMotion: "reduce" });

      expect(
        await skeleton.evaluate(
          (element) => getComputedStyle(element, "::after").animationName,
        ),
      ).toBe("none");
      await expect(page.locator("#catalogo a h3").first()).toBeVisible();
    });

    test("detalhe lento mostra skeleton antes das informações", async ({
      page,
    }) => {
      await startWithScenario(
        page,
        "/nfts/emerald-ape-042",
        "catalogue",
        "slow",
      );

      await expect(page.locator("main .skeleton").first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ }),
      ).toBeVisible();
      await expect(page.locator("main .skeleton")).toHaveCount(0);
    });

    test("resumo do carrinho apresenta skeleton até receber a cotação", async ({
      page,
    }) => {
      await openNFT(page);
      await addItem(page);
      await setScenario(page, "cart", "slow");

      await page.goto("/carrinho");

      await expect(page.locator("main .skeleton").first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Conectar e finalizar", exact: true }),
      ).toBeEnabled({ timeout: 12_000 });
      await expect(page.locator("main .skeleton")).toHaveCount(0);
    });
  });
}

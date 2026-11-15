import { expect, test } from "@playwright/test";
import { completeLogin } from "../helpers/auth";
import {
  addItem,
  cartLine,
  openNFT,
  readCart,
  seedAccountCart,
  viewports,
} from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Persistência do carrinho ${viewport.name}`, () => {
    test.use({ viewport });

    test("une visitante e conta e preserva quantidades após novo login", async ({
      page,
    }) => {
      await openNFT(page);
      await seedAccountCart(page);
      await addItem(page, 2);
      await page.goto("/carrinho");

      await page
        .getByRole("button", { name: "Conectar e finalizar", exact: true })
        .click();
      await completeLogin(page);

      await expect(page).toHaveURL(/\/pagamento/);
      expect((await readCart(page)).totalQuantity).toBe(3);

      await page.goto("/carrinho");
      await page.reload();

      await expect(
        cartLine(page)
          .getByText("3.57 ETH", { exact: true })
          .filter({ visible: true }),
      ).toBeVisible();

      await page.evaluate(async () => {
        const url = "/src/services/auth/logout.ts";
        const { logoutUser } = await import(url);

        await logoutUser();
      });
      await page.goto("/login?redirect=%2Fcarrinho");
      await completeLogin(page);

      expect((await readCart(page)).totalQuantity).toBe(3);
    });
  });
}

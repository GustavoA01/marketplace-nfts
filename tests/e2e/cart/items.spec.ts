import { expect, test } from "@playwright/test";
import {
  addItem,
  cartLine,
  openNFT,
  readCart,
  setScenario,
  viewports,
} from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Carrinho ${viewport.name}`, () => {
    test.use({ viewport });

    test("adiciona, altera quantidade, persiste e remove pela interface", async ({
      page,
    }) => {
      await openNFT(page);

      await page.getByRole("button", { name: "1/50", exact: true }).click();
      await page
        .getByRole("button", { name: /^(COMPRAR|Comprar NFT)$/ })
        .click();
      await cartLine(page)
        .getByRole("button", { name: "Aumentar quantidade" })
        .click();

      await expect(
        cartLine(page)
          .getByText("2.38 ETH", { exact: true })
          .filter({ visible: true }),
      ).toBeVisible();
      expect((await readCart(page)).totalQuantity).toBe(2);

      await page.reload();

      await expect(
        cartLine(page)
          .getByText("2.38 ETH", { exact: true })
          .filter({ visible: true }),
      ).toBeVisible();

      await cartLine(page)
        .getByRole("button", { name: "Diminuir quantidade" })
        .click();

      await expect(
        cartLine(page).getByRole("button", { name: "Diminuir quantidade" }),
      ).toBeDisabled();

      await cartLine(page)
        .getByRole("button", { name: /Remover Emerald/ })
        .click();

      await expect(
        page.getByRole("heading", { name: "Seu carrinho está vazio" }),
      ).toBeVisible();
    });

    test("mantém itens após falha de remoção e permite tentar de novo", async ({
      page,
    }) => {
      await openNFT(page);
      await addItem(page);
      await setScenario(page, "cart", "mutation-error");
      await page.goto("/carrinho");

      await cartLine(page)
        .getByRole("button", { name: /Remover Emerald/ })
        .click();

      await expect(
        page
          .getByText("O carrinho está temporariamente indisponível.", {
            exact: true,
          })
          .first(),
      ).toBeVisible();
      await expect(cartLine(page)).toContainText("Emerald Ape #042");
      expect((await readCart(page)).items).toHaveLength(1);

      await setScenario(page, "cart");
      await cartLine(page)
        .getByRole("button", { name: /Remover Emerald/ })
        .click();

      await expect(
        page.getByRole("heading", { name: "Seu carrinho está vazio" }),
      ).toBeVisible();
    });
  });
}

test("soma edições sem ultrapassar o estoque e rejeita quantidade excessiva", async ({
  page,
}) => {
  await openNFT(page);
  await addItem(page, 1, "1/1");

  const status = await page.evaluate(async () => {
    const url = "/src/services/cart/add.ts";
    const { addCartItem } = await import(url);

    try {
      await addCartItem({
        nftId: "emerald-ape-042",
        quantity: 1,
        edition: "1/1",
      });
    } catch (error) {
      return (error as { response: { status: number } }).response.status;
    }
  });

  expect(status).toBe(409);
  expect((await readCart(page)).totalQuantity).toBe(1);

  await addItem(page, 2, "1/50");
  await page.goto("/carrinho");

  await expect(
    page.locator("main article").filter({ hasText: "Edição:" }),
  ).toHaveCount(2);
  expect((await readCart(page)).totalQuantity).toBe(3);
});

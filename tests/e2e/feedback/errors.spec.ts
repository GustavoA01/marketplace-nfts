import { expect, test } from "@playwright/test";
import { catalogueNames } from "../helpers/catalogue";
import {
  addItem,
  openNFT,
  setScenario,
  startWithScenario,
} from "../helpers/mocks";

for (const failure of ["error", "offline"]) {
  test(`catálogo recupera ${failure} por nova tentativa`, async ({ page }) => {
    await startWithScenario(page, "/", "catalogue", failure);

    await expect(
      page.getByText("Não foi possível carregar os NFTs. Tente novamente.", {
        exact: true,
      }),
    ).toBeVisible();

    await setScenario(page, "catalogue");
    await page
      .getByRole("button", { name: "Tentar novamente", exact: true })
      .click();

    await expect(catalogueNames(page).first()).toBeVisible();
  });
}

test("detalhe recupera falha e preserva destino", async ({ page }) => {
  await startWithScenario(page, "/nfts/emerald-ape-042", "catalogue", "error");

  await expect(page.getByRole("alert").first()).toBeVisible();

  await setScenario(page, "catalogue");
  await page
    .getByRole("button", { name: "Tentar novamente", exact: true })
    .first()
    .click();

  await expect(
    page.getByRole("button", { name: "COMPRAR", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/emerald-ape-042/);
});

test("carrinho recupera falha sem perder os itens", async ({ page }) => {
  await openNFT(page);
  await addItem(page);
  await setScenario(page, "cart", "error");
  await page.goto("/carrinho");

  await expect(
    page.getByText("Não foi possível carregar o carrinho.", { exact: true }),
  ).toBeVisible();

  await setScenario(page, "cart");
  await page
    .getByRole("button", { name: "Tentar novamente", exact: true })
    .click();

  await expect(page.getByText("Edição: 1/50", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Conectar e finalizar", exact: true }),
  ).toBeEnabled();
});

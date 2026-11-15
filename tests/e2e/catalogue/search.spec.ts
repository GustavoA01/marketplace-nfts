import { expect, test } from "@playwright/test";
import {
  catalogueNames,
  filters,
  searchNFTs,
  waitForCatalogue,
} from "../helpers/catalogue";
import { viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Catálogo ${viewport.name}`, () => {
    test.use({ viewport });

    test("busca, filtros combinados, ordenação e histórico preservam a URL", async ({
      page,
    }) => {
      await page.goto("/");
      await waitForCatalogue(page);
      const initialNames = await catalogueNames(page).allTextContents();

      await page
        .locator("#catalogo")
        .getByRole("button", { name: "Próxima página" })
        .click();

      await expect(page).toHaveURL(/page=2/);
      await waitForCatalogue(page);
      expect(await catalogueNames(page).allTextContents()).not.toEqual(
        initialNames,
      );

      const panel = await filters(page, viewport.name === "mobile");

      await panel.getByRole("button", { name: /^Colecionáveis/ }).click();
      await panel.getByRole("button", { name: /^ethereum/i }).click();
      await panel.getByRole("button", { name: "Aplicar", exact: true }).click();

      if (viewport.name === "mobile") await page.keyboard.press("Escape");

      await waitForCatalogue(page);
      await expect(page).not.toHaveURL(/page=2/);
      expect(new URL(page.url()).searchParams.get("category")).toContain(
        "Colecionáveis",
      );
      expect(new URL(page.url()).searchParams.get("network")).toContain(
        "Ethereum",
      );
      expect(new URL(page.url()).searchParams.has("minPrice")).toBe(true);

      await page.locator("#catalogo").getByRole("combobox").click();
      await page
        .getByRole("option", { name: "Menor preço", exact: true })
        .click();
      await searchNFTs(page, "Emerald Ape", viewport.name === "mobile");

      await waitForCatalogue(page);
      await expect(page).toHaveURL(/sort=price-asc/);
      await expect(page).toHaveURL(/q=Emerald/);
      await expect(catalogueNames(page)).toHaveText(["Emerald Ape #042"]);
      const selectedURL = page.url();

      await page.reload();

      await waitForCatalogue(page);
      expect(page.url()).toBe(selectedURL);

      await page
        .locator("#catalogo")
        .getByRole("button", { name: "Limpar busca" })
        .click();

      await expect(page).not.toHaveURL(/q=Emerald/);

      await page.goBack();

      await expect(page).toHaveURL(selectedURL);
      await expect(catalogueNames(page)).toHaveText(["Emerald Ape #042"]);

      await page.goForward();

      await expect(page).not.toHaveURL(/q=Emerald/);
    });

    test("ordena os resultados pelos preços e abre o detalhe pelo card", async ({
      page,
    }) => {
      await page.goto("/");
      await waitForCatalogue(page);

      const responsePromise = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === "/api/nfts" &&
          response.url().includes("price-desc"),
      );
      await page.locator("#catalogo").getByRole("combobox").click();
      await page
        .getByRole("option", { name: "Maior preço", exact: true })
        .click();
      const data = await (await responsePromise).json();

      await expect(catalogueNames(page)).toHaveText(
        data.items.map((item: { name: string }) => item.name),
      );
      const prices = data.items.map((item: { price: string }) =>
        Number(item.price),
      );
      expect(prices).toEqual([...prices].sort((a, b) => b - a));

      await catalogueNames(page).first().click();

      await expect(page).toHaveURL(new RegExp(`/nfts/${data.items[0].id}`));
      await expect(
        page
          .getByRole("heading", { name: data.items[0].name, exact: true })
          .first(),
      ).toBeVisible();
    });
  });
}

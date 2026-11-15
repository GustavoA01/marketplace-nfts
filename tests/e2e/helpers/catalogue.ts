import { expect, type Page } from "@playwright/test";

export const searchNFTs = async (page: Page, term: string, mobile = false) => {
  if (!mobile)
    await page
      .locator("header")
      .getByRole("button", { name: "Buscar NFTs", exact: true })
      .click();

  const search = mobile
    ? page.getByRole("searchbox")
    : page.getByRole("dialog").getByRole("searchbox");

  await search.fill(term);
  await search.press("Enter");
};

export const catalogueNames = (page: Page) => page.locator("#catalogo a h3");

export const waitForCatalogue = async (page: Page) => {
  await expect(catalogueNames(page).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("#catalogo")).toHaveAttribute("aria-busy", "false");
};

export const filters = async (page: Page, mobile: boolean) => {
  if (mobile) {
    await page.getByRole("button", { name: "Filtros", exact: true }).click();

    return page.getByRole("dialog");
  }

  return page.locator("#catalogo aside");
};

import { expect, type Page } from "@playwright/test";

export const fillWallet = async (
  page: Page,
  kind: "main" | "secondary",
  alias: string,
  address: string,
) => {
  const prefix = `#${kind}-wallet-`;
  const form = page
    .locator("form")
    .filter({ has: page.locator(`${prefix}address`) });

  await page.locator(`${prefix}displayName`).fill("Colecionador de teste");
  await page.locator(`${prefix}alias`).fill(alias);
  await page.locator(`${prefix}profileName`).fill("coletor");
  await page.locator(`${prefix}address`).fill(address);
  await page.locator(`${prefix}email`).fill("theo@example.com");
  await form.getByRole("combobox", { name: /^Rede/ }).click();
  await page.getByRole("option", { name: "Ethereum", exact: true }).click();
  await form.getByRole("combobox", { name: /^Tipo de carteira/ }).click();
  await page.getByRole("option", { name: "MetaMask", exact: true }).click();

  return form;
};

export const saveWallet = async (page: Page, kind: "main" | "secondary") => {
  const form = page
    .locator("form")
    .filter({ has: page.locator(`#${kind}-wallet-address`) });

  await form.getByRole("button", { name: /^Salvar/ }).click();

  await expect(
    form.getByText(
      kind === "main" ? "Carteira salva." : "Carteira secundária salva.",
      { exact: true },
    ),
  ).toBeVisible();
};

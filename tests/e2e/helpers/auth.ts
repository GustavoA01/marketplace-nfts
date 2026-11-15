import { expect, type Page } from "@playwright/test";

export const completeLogin = async (page: Page, email = "luna@example.com") => {
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("Colecionador123!");
  await page
    .locator("form")
    .getByRole("button", { name: "Entrar", exact: true })
    .click();
  await expect(
    page.getByText("Login concluído com sucesso!", { exact: true }),
  ).toBeVisible();
  await page
    .locator("[data-sonner-toast]")
    .filter({ hasText: "Login concluído com sucesso!" })
    .getByRole("button", { name: "Close toast", exact: true })
    .click();
  await expect(
    page.getByText("Login concluído com sucesso!", { exact: true }),
  ).not.toBeVisible();
};

export const loginAtNFT = async (page: Page, email = "luna@example.com") => {
  await page.goto("/login?redirect=%2Fnfts%2Femerald-ape-042");
  await completeLogin(page, email);
  await expect(page).toHaveURL(/\/nfts\/emerald-ape-042\/?$/);
};

export const logout = async (page: Page) => {
  await page.goto("/perfil");
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(
    page.getByText("Você saiu da sua conta.", { exact: true }),
  ).toBeVisible();
};

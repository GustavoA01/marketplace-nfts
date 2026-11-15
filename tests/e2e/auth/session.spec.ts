import { expect, test } from "@playwright/test";
import { completeLogin, logout } from "../helpers/auth";
import { viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Sessão ${viewport.name}`, () => {
    test.use({ viewport });

    test("rejeita senha incorreta e permite recuperar o acesso", async ({
      page,
    }) => {
      await page.goto("/login?redirect=%2Fperfil");

      await page.getByLabel("E-mail", { exact: true }).fill("luna@example.com");
      await page.getByLabel("Senha", { exact: true }).fill("SenhaIncorreta!");
      await page
        .locator("form")
        .getByRole("button", { name: "Entrar", exact: true })
        .click();

      await expect(
        page.getByText("E-mail ou senha inválidos.", { exact: true }).first(),
      ).toBeVisible();
      await expect(page).toHaveURL(/\/login/);

      await completeLogin(page);

      await expect(page.locator("#email")).toHaveValue("luna@example.com");

      await logout(page);
      await page.goto("/perfil");

      await expect(page).toHaveURL(/\/login\?.*redirect=/);
    });
  });
}

for (const path of [
  "/perfil",
  "/carteiras",
  "/favoritos",
  "/pagamento",
  "/confirmacao-pedido?attempt=0",
]) {
  test(`protege acesso direto a ${path}`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL(/\/login\?.*redirect=/);
    await expect(page.getByLabel("E-mail", { exact: true })).toBeVisible();
  });
}

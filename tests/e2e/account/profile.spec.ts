import { expect, test } from "@playwright/test";
import { loginAtNFT, logout } from "../helpers/auth";
import { viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Perfil ${viewport.name}`, () => {
    test.use({ viewport });

    test("salva dados e avatar, preserva após refresh e permite remover imagem", async ({
      page,
    }) => {
      await loginAtNFT(page);
      await page.goto("/perfil");

      await page.locator("#displayName").fill("Luna atualizada");
      await page.locator("#username").fill("lunaatualizada");
      await page.locator("#email").fill("luna.nova@example.com");
      await page.getByRole("button", { name: "Salvar", exact: true }).click();

      await expect(
        page.getByText("Perfil atualizado.", { exact: true }),
      ).toBeVisible();

      await page.locator('input[type="file"]').setInputFiles({
        name: "avatar.png",
        mimeType: "image/png",
        buffer: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aUVsAAAAASUVORK5CYII=",
          "base64",
        ),
      });

      await expect(
        page.getByText("Avatar atualizado.", { exact: true }),
      ).toBeVisible();

      await page.reload();

      await expect(page.locator("#displayName")).toHaveValue("Luna atualizada");
      await expect(page.locator("#email")).toHaveValue("luna.nova@example.com");
      await expect(
        page.getByRole("img", { name: "Avatar do perfil", exact: true }),
      ).toHaveAttribute("src", /^data:image\/png/);

      await page.getByRole("button", { name: "Remover", exact: true }).click();

      await expect(
        page.getByText("Avatar removido.", { exact: true }),
      ).toBeVisible();

      await page.reload();

      await expect(
        page.getByRole("img", { name: "Avatar do perfil", exact: true }),
      ).toHaveCount(0);
    });

    test("trata conflito e valida senha atual antes de alterar a senha", async ({
      page,
    }) => {
      await loginAtNFT(page);
      await page.goto("/perfil");

      await page.locator("#email").fill("theo@example.com");
      await page.getByRole("button", { name: "Salvar", exact: true }).click();

      await expect(
        page.getByText("Este e-mail já está em uso.", { exact: true }).first(),
      ).toBeVisible();
      await expect(page.locator("#email")).toHaveAttribute(
        "aria-invalid",
        "true",
      );

      await page.locator("#email").fill("luna@example.com");
      await page.locator("#currentPassword").fill("Incorreta123!");
      await page.locator("#newPassword").fill("NovaSenha123!");
      await page.locator("#confirmNewPassword").fill("Diferente123!");
      await page.getByRole("button", { name: "Salvar", exact: true }).click();

      await expect(
        page.getByText("As senhas não coincidem", { exact: true }),
      ).toBeVisible();

      await page.locator("#confirmNewPassword").fill("NovaSenha123!");
      await page.getByRole("button", { name: "Salvar", exact: true }).click();

      await expect(
        page.getByText("Senha atual incorreta.", { exact: true }).first(),
      ).toBeVisible();

      await page.locator("#currentPassword").fill("Colecionador123!");
      await page.getByRole("button", { name: "Salvar", exact: true }).click();

      await expect(
        page.getByText("Perfil atualizado.", { exact: true }),
      ).toBeVisible();

      await logout(page);
      await page.goto("/login?redirect=%2Fperfil");
      await page.getByLabel("E-mail", { exact: true }).fill("luna@example.com");
      await page.getByLabel("Senha", { exact: true }).fill("NovaSenha123!");
      await page
        .locator("form")
        .getByRole("button", { name: "Entrar", exact: true })
        .click();

      await expect(page).toHaveURL(/\/perfil/);
      await expect(page.locator("#email")).toHaveValue("luna@example.com");
    });
  });
}

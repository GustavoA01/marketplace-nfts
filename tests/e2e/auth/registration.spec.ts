import { expect, test } from "@playwright/test";
import { completeLogin } from "../helpers/auth";
import { viewports } from "../helpers/mocks";

for (const viewport of viewports) {
  test.describe(`Cadastro ${viewport.name}`, () => {
    test.use({ viewport });

    test("cadastra pela interface e recupera sessão após refresh", async ({
      page,
    }) => {
      await page.goto("/cadastro");

      await page
        .getByLabel("Nome de usuário", { exact: true })
        .fill("novocolecionador");
      await page.getByLabel("E-mail", { exact: true }).fill("novo@example.com");
      await page.getByLabel("Senha", { exact: true }).fill("Colecionador123!");
      await page
        .getByLabel("Confirmar senha", { exact: true })
        .fill("Colecionador123!");
      await page
        .locator("form")
        .getByRole("button", { name: /Criar (conta|perfil)/ })
        .click();

      await expect(
        page.getByText("Conta criada. Agora faça login.", { exact: true }),
      ).toBeVisible();

      await page.goto("/login?redirect=%2Fperfil");
      await completeLogin(page, "novo@example.com");
      await page.reload();

      await expect(page.locator("#username")).toHaveValue("novocolecionador");
      await expect(page.locator("#email")).toHaveValue("novo@example.com");
    });

    test("exibe validação local e conflito retornado pelo cadastro", async ({
      page,
    }) => {
      await page.goto("/cadastro");

      await page.getByLabel("Nome de usuário", { exact: true }).fill("ab");
      await page.getByLabel("E-mail", { exact: true }).fill("luna@example.com");
      await page.getByLabel("Senha", { exact: true }).fill("curta");
      await page
        .getByLabel("Confirmar senha", { exact: true })
        .fill("diferente");
      await page
        .locator("form")
        .getByRole("button", { name: /Criar (conta|perfil)/ })
        .click();

      await expect(
        page.getByText("As senhas não coincidem", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByLabel("Nome de usuário", { exact: true }),
      ).toHaveAttribute("aria-invalid", "true");

      await page
        .getByLabel("Nome de usuário", { exact: true })
        .fill("outrocoletor");
      await page.getByLabel("Senha", { exact: true }).fill("Colecionador123!");
      await page
        .getByLabel("Confirmar senha", { exact: true })
        .fill("Colecionador123!");
      await page
        .locator("form")
        .getByRole("button", { name: /Criar (conta|perfil)/ })
        .click();

      await expect(
        page
          .getByText("Este e-mail já está cadastrado.", { exact: true })
          .first(),
      ).toBeVisible();
      await expect(page.getByLabel("E-mail", { exact: true })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });
}

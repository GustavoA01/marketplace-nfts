import { expect, test } from "@playwright/test";
import { loginAtNFT } from "../helpers/auth";
import { addItem, setScenario, viewports } from "../helpers/mocks";
import { fillWallet, saveWallet } from "../helpers/wallets";

for (const viewport of viewports) {
  test.describe(`Formulários de carteiras ${viewport.name}`, () => {
    test.use({ viewport });

    test("cadastra principal e secundária, edita e persiste após refresh", async ({
      page,
    }) => {
      await loginAtNFT(page, "theo@example.com");
      await page.goto("/carteiras");

      await fillWallet(
        page,
        "main",
        "Principal de teste",
        "0x1111111111111111111111111111111111111111",
      );
      await saveWallet(page, "main");
      await page
        .getByRole("button", { name: "Adicionar", exact: true })
        .click();
      await fillWallet(
        page,
        "secondary",
        "Secundária de teste",
        "0x2222222222222222222222222222222222222222",
      );
      await saveWallet(page, "secondary");

      await page.reload();

      await expect(page.locator("#main-wallet-alias")).toHaveValue(
        "Principal de teste",
      );
      await expect(page.locator("#secondary-wallet-alias")).toHaveValue(
        "Secundária de teste",
      );

      await page.locator("#main-wallet-alias").fill("Principal editada");
      await saveWallet(page, "main");
      await page.reload();

      await expect(page.locator("#main-wallet-alias")).toHaveValue(
        "Principal editada",
      );
      await expect(page.locator("#secondary-wallet-alias")).toHaveValue(
        "Secundária de teste",
      );
    });

    test("valida endereço e mantém preenchimento após falha da API", async ({
      page,
    }) => {
      await loginAtNFT(page, "theo@example.com");
      await page.goto("/carteiras");
      const form = await fillWallet(
        page,
        "main",
        "Carteira preservada",
        "endereco-invalido",
      );

      await form.getByRole("button", { name: /^Salvar/ }).click();

      await expect(
        page.getByText("Informe um endereço 0x válido", { exact: true }),
      ).toBeVisible();

      await page
        .locator("#main-wallet-address")
        .fill("0x1111111111111111111111111111111111111111");
      await setScenario(page, "wallet", "mutation-error");
      await form.getByRole("button", { name: /^Salvar/ }).click();

      await expect(
        page.getByText("As carteiras estão temporariamente indisponíveis.", {
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator("#main-wallet-alias")).toHaveValue(
        "Carteira preservada",
      );

      await setScenario(page, "wallet");
      await saveWallet(page, "main");
    });

    test("cadastro iniciado na compra permite voltar ao pagamento", async ({
      page,
    }) => {
      await loginAtNFT(page, "theo@example.com");
      await addItem(page);
      await page.goto("/pagamento");

      await page.getByRole("link", { name: /Gerenciar carteiras/ }).click();

      await expect(page).toHaveURL(/returnTo=/);

      await fillWallet(
        page,
        "main",
        "Carteira da compra",
        "0x1111111111111111111111111111111111111111",
      );
      await saveWallet(page, "main");
      await page
        .getByRole("button", { name: "Voltar ao pagamento", exact: true })
        .click();

      await expect(page).toHaveURL(/\/pagamento/);
      await expect(
        page.getByRole("button", { name: "Conectar carteira", exact: true }),
      ).toBeVisible();
    });
  });
}

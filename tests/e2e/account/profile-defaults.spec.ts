import { expect, test, type Page } from "@playwright/test";
import { completeLogin } from "../helpers/auth";

const prepareAccount = async (page: Page, legacy = false) => {
  await page.goto("/login?redirect=%2Fperfil");

  await expect(page.getByLabel("E-mail", { exact: true })).toBeVisible();

  await page.evaluate(async (legacy) => {
    const url = "/src/services/auth/sign-up.ts";
    const { registerUser } = await import(url);
    const { user } = await registerUser({
      username: "newcollector",
      email: "newcollector@example.com",
      password: "Colecionador123!",
      confirmPassword: "Colecionador123!",
    });

    if (legacy) {
      const key = "marketplace-nfts:mock-users:v1";
      const users = JSON.parse(localStorage.getItem(key) ?? "[]") as {
        id: string;
        walletAlias: string;
      }[];
      const storedUser = users.find((entry) => entry.id === user.id);

      if (!storedUser) throw new Error("Usuário não encontrado no cenário.");

      storedUser.walletAlias = "Carteira principal";
      localStorage.setItem(key, JSON.stringify(users));
    }
  }, legacy);

  await completeLogin(page, "newcollector@example.com");

  await expect(page).toHaveURL(/\/perfil\/?$/);
};

test("perfil novo permite salvar dados pessoais sem carteira ou ENS", async ({
  page,
}) => {
  await prepareAccount(page);

  await expect(page.getByLabel("Nome de exibição")).toHaveValue("newcollector");
  await expect(page.getByLabel("Nome de usuário")).toHaveValue("newcollector");
  await expect(page.getByLabel("E-mail")).toHaveValue(
    "newcollector@example.com",
  );
  await expect(
    page.getByLabel("Apelido da carteira", { exact: true }),
  ).toHaveValue("");
  await expect(page.getByLabel("Nome ENS", { exact: true })).toHaveValue("");

  await page.getByLabel("Nome de exibição").fill("Novo colecionador");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  await expect(
    page.getByText("Perfil atualizado.", { exact: true }),
  ).toBeVisible();

  await page.reload();

  await expect(page.getByLabel("Nome de exibição")).toHaveValue(
    "Novo colecionador",
  );
  await expect(
    page.getByLabel("Apelido da carteira", { exact: true }),
  ).toHaveValue("");
  await expect(page.getByLabel("Nome ENS", { exact: true })).toHaveValue("");

  const wallets = await page.evaluate(async () => {
    const url = "/src/services/wallets/list.ts";
    const { getWallets } = await import(url);

    return getWallets();
  });

  expect(wallets).toEqual([]);
});

test("limpa o apelido automático de conta antiga e preserva um apelido personalizado", async ({
  page,
}) => {
  await prepareAccount(page, true);

  await expect(
    page.getByLabel("Apelido da carteira", { exact: true }),
  ).toHaveValue("");

  await page
    .getByLabel("Apelido da carteira", { exact: true })
    .fill("Minha carteira preferida");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  await expect(
    page.getByText("Perfil atualizado.", { exact: true }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByLabel("Apelido da carteira", { exact: true }),
  ).toHaveValue("Minha carteira preferida");
  await expect(page.getByLabel("Nome de usuário")).toHaveValue("newcollector");
});

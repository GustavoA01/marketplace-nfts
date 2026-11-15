import { expect, test } from "@playwright/test";
import { loginAtNFT } from "./helpers/auth";

test.use({ viewport: { width: 1440, height: 1000 } });

test("demonstração funciona pela interface, sem importar fontes de desenvolvimento", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await loginAtNFT(page);

  await page.getByRole("button", { name: "COMPRAR", exact: true }).click();

  await expect(page).toHaveURL(/\/carrinho/);

  await page.goto("/pagamento?scenario=price-change");
  await page
    .getByRole("button", { name: "Conectar carteira", exact: true })
    .click();

  await expect(
    page.getByRole("button", { name: "Desconectar carteira", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "O preço ou a disponibilidade de um NFT mudou. Revise os valores antes de confirmar.",
      { exact: true },
    ),
  ).toBeVisible({ timeout: 12_000 });
  await expect(
    page
      .getByText("1.49 ETH", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();

  const confirm = page.getByRole("button", {
    name: "Confirmar compra",
    exact: true,
  });

  await expect(confirm).toBeDisabled();

  await page
    .getByRole("checkbox", {
      name: "Revisei os itens, a carteira e o total desta compra.",
    })
    .check();

  await expect(confirm).toBeEnabled();

  await confirm.click();

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("1.49 ETH", { exact: true }).first(),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
});

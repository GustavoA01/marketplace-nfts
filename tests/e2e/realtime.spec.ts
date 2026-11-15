import { expect, test } from "@playwright/test";
import { loginAtNFT } from "./helpers/auth";
import { seedCheckout } from "./helpers/checkout";
import {
  captureEvents,
  controlRealtime,
  expectConnected,
} from "./helpers/realtime";

test("recebe atualização pelo cliente Socket.IO e mantém REST consistente", async ({
  page,
}) => {
  await page.goto("/nfts/emerald-ape-042");

  await expect(
    page
      .getByRole("heading", { name: "Emerald Ape #042", exact: true })
      .first(),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const url = "/src/lib/http.ts";
        const { http } = await import(url);
        const { data } = await http.get("/mock/realtime");

        return data.connections;
      }),
    )
    .toBe(1);

  await page.evaluate(async () => {
    const url = "/src/lib/http.ts";
    const { http } = await import(url);

    await http.post("/mock/realtime", {
      action: "update-nft",
      nftId: "emerald-ape-042",
      price: "1.49",
    });
  });

  await expect(
    page
      .getByText("1.49 ETH", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();

  const price = await page.evaluate(async () => {
    const url = "/src/services/nfts/detail.ts";
    const { getNFT } = await import(url);

    return (await getNFT("emerald-ape-042")).price;
  });

  expect(price).toBe("1.49");
});

test("cenário pela URL altera preço automaticamente no carrinho", async ({
  page,
}) => {
  await page.clock.install();
  await loginAtNFT(page);
  await seedCheckout(page);
  await page.goto("/carrinho?scenario=price-change");
  await expectConnected(page);
  const events = await captureEvents(page);

  await expect(
    page
      .getByText("1.19 ETH", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();

  await page.clock.fastForward(5100);

  await expect
    .poll(() =>
      events.evaluate((events) => events.nfts[events.nfts.length - 1]?.price),
    )
    .toBe("1.49");
  await expect(
    page
      .getByText("1.49 ETH", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Conectar e finalizar", exact: true })
    .click();

  await expect(page).toHaveURL(/\/pagamento/);

  const confirm = page.getByRole("button", {
    name: "Confirmar compra",
    exact: true,
  });

  await expect(confirm).toBeDisabled();

  await page
    .getByRole("button", { name: "Conectar carteira", exact: true })
    .click();

  await expect(
    page.getByRole("button", { name: "Desconectar carteira", exact: true }),
  ).toBeVisible();

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
});

test("reset pela URL restaura fixtures, carrinho e sessão sem apagar outros dados", async ({
  page,
}) => {
  await loginAtNFT(page);
  await seedCheckout(page);

  await controlRealtime(page, {
    action: "update-nft",
    nftId: "emerald-ape-042",
    price: "1.49",
  });
  await page.evaluate(() => localStorage.setItem("unrelated-key", "preservar"));
  await page.goto("/nfts/emerald-ape-042?scenario=reset");

  await expect(
    page
      .getByText("1.19 ETH", { exact: true })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Entrar", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("unrelated-key"))).toBe(
    "preservar",
  );

  await page.goto("/carrinho");

  await expect(
    page.getByRole("heading", { name: "Seu carrinho está vazio" }),
  ).toBeVisible();
});

import { expect, test } from "@playwright/test";
import { completeLogin, logout } from "./helpers/auth";
import {
  captureEvents,
  controlRealtime,
  expectConnected,
  connectionCount,
  preparePayment,
  startPendingOrder,
} from "./helpers/realtime";

for (const outcome of ["confirmed", "declined"] as const) {
  test(`pedido ${outcome} recebe evento e preserva snapshot ou carrinho`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.clock.install();
    const { attempt, events } = await startPendingOrder(page);
    let consultations = 0;
    page.on("request", (request) => {
      if (
        request.method() === "GET" &&
        new URL(request.url()).pathname === "/api/orders"
      )
        consultations += 1;
    });

    await page.clock.fastForward(3000);

    expect(consultations).toBe(0);

    if (outcome === "confirmed")
      await controlRealtime(page, {
        action: "update-nft",
        nftId: "emerald-ape-042",
        price: "1.49",
      });

    await controlRealtime(page, { action: "settle-order", attempt, outcome });

    await expect
      .poll(() =>
        events.evaluate(
          (events) => events.orders[events.orders.length - 1]?.status,
        ),
      )
      .toBe(outcome);

    if (outcome === "confirmed") {
      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();
      await expect(
        page.getByText("1.19 ETH", { exact: true }).first(),
      ).toBeVisible();

      await controlRealtime(page, { action: "replay-order", outdated: true });

      await expect
        .poll(() =>
          events.evaluate(
            (events) => events.orders[events.orders.length - 1]?.status,
          ),
        )
        .toBe("pending");
      await expect(
        page.getByRole("heading", {
          name: "Seus NFTs agora estão na sua carteira",
        }),
      ).toBeVisible();

      await page.goto("/carrinho");

      await expect(
        page.getByRole("heading", { name: "Seu carrinho está vazio" }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole("heading", { name: "Pagamento recusado" }),
      ).toBeVisible();

      await page.goto("/carrinho");

      await expect(
        page.getByText("Emerald Ape #042", { exact: true }).first(),
      ).toBeVisible();
    }
  });
}

test("reconecta e recupera pedido concluído durante interrupção sem repetir compra", async ({
  page,
}) => {
  test.setTimeout(60_000);
  let submissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/orders"
    )
      submissions += 1;
  });
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, { action: "disconnect", milliseconds: 1800 });

  await expect(
    page.getByText(
      "Conexão interrompida. Tentando reconectar para atualizar seu pedido.",
      { exact: true },
    ),
  ).toBeVisible();

  await controlRealtime(page, { action: "settle-order", attempt });

  await expectConnected(page);
  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  expect(submissions).toBe(1);
});

test("recupera pedido após refresh sem reenviar a compra", async ({ page }) => {
  const { attempt } = await startPendingOrder(page);

  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Pagamento pendente" }),
  ).toBeVisible();
  await expectConnected(page);

  await controlRealtime(page, { action: "settle-order", attempt });

  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
});

test("libera conexão anterior e não entrega pedido de outra conta", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.clock.install();
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, {
    action: "settle-order",
    attempt,
    delay: 30_000,
  });
  await logout(page);
  await page.goto("/login?redirect=%2Fperfil");
  await completeLogin(page, "theo@example.com");
  await expectConnected(page);
  const received = await captureEvents(page);
  await page.clock.fastForward(31_000);

  await expect(page.getByLabel("Nome de usuário")).toHaveValue("theocollector");
  expect(await received.evaluate((events) => events.orders.length)).toBe(0);

  const status = await page.evaluate(async (attempt) => {
    const url = "/src/services/orders/index.ts";
    const { getOrder } = await import(url);

    try {
      await getOrder(attempt);
      return undefined;
    } catch (error) {
      return (error as { response?: { status: number } }).response?.status;
    }
  }, attempt);

  expect(status).toBe(404);

  await logout(page);
  await page.goto("/login?redirect=%2Fperfil");
  await completeLogin(page);
  const completed = await page.evaluate(async (attempt) => {
    const url = "/src/services/orders/index.ts";
    const { getOrder } = await import(url);

    return (await getOrder(attempt)).status;
  }, attempt);

  expect(completed).toBe("confirmed");
});

test("sessão expirada encerra assinatura privada e preserva destino do login", async ({
  page,
}) => {
  const { attempt } = await startPendingOrder(page);

  await controlRealtime(page, { action: "expire-session" });

  await expect(page).toHaveURL(/\/login\?.*redirect=/);

  await completeLogin(page);

  await expect(page).toHaveURL(new RegExp(`confirmacao-pedido.*${attempt}`));
  await expectConnected(page);
  await expect(
    page.getByRole("heading", { name: "Pagamento pendente" }),
  ).toBeVisible();
});

test("interrupção prolongada mostra um único toast e recupera a compra", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.clock.install();
  let submissions = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/orders"
    )
      submissions += 1;
  });
  const { confirm } = await preparePayment(page, "disconnect-order");
  const notice = page.getByText(
    "Conexão interrompida. Tentando reconectar automaticamente.",
    { exact: true },
  );

  await confirm.click();

  await expect(notice).toBeVisible();

  await page.clock.fastForward(4000);

  await expect.poll(() => connectionCount(page)).toBe(0);
  await expect(notice).toHaveCount(1);

  await page.clock.fastForward(3000);

  await expectConnected(page);
  await expect(notice).not.toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Seus NFTs agora estão na sua carteira",
    }),
  ).toBeVisible();
  expect(submissions).toBe(1);
});
